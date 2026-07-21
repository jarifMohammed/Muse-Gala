import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useCallback } from 'react'
import { useSocketStore } from '@/zustand/socketStore'
import { useUserStore } from '@/zustand/useUserStore'

interface Attachment {
  url: string
  type: string
  fileName: string
  size: number
  mimeType: string
}

interface Sender {
  _id: string
  firstName: string
  lastName: string
  profileImage?: string
  role?: 'USER' | 'LENDER'
}

interface Message {
  _id: string
  chatRoom: string | { _id?: string }
  sender: Sender
  message: string
  attachments: Attachment[]
  readBy: string[]
  createdAt: string
  updatedAt: string
}

interface MessageResponse {
  status: boolean
  message: string
  data: {
    messages: Message[]
    pagination: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
}

const getMessageRoomId = (message: Message) =>
  typeof message.chatRoom === 'string' ? message.chatRoom : message.chatRoom?._id

export const useChat = (roomId?: string) => {
  const queryClient = useQueryClient()
  const { socket, isConnected } = useSocketStore()
  const { user } = useUserStore()
  const accessToken = user?.accessToken
  const currentRoomRef = useRef<string | null>(null)

  // ✅ Infinite query for paginated messages
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['messages', roomId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!roomId || !accessToken) {
        console.log('❌ Missing roomId or accessToken')
        return { messages: [], hasMore: false, nextPage: 1 }
      }

      console.log('🔥 Fetching messages for room:', roomId, 'page:', pageParam)
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/${roomId}/?page=${pageParam}&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!res.ok) {
          console.log('❌ API response not ok:', res.status)
          throw new Error(`Failed to fetch messages: ${res.status}`)
        }

        const json: MessageResponse = await res.json()

        console.log('✅ Messages fetched successfully:', {
          roomId,
          page: pageParam,
          count: json?.data?.messages?.length || 0,
          totalPages: json?.data?.pagination?.pages,
          currentPage: json?.data?.pagination?.page,
        })

        return {
          messages: json?.data?.messages || [],
          hasMore: json?.data?.pagination?.page < json?.data?.pagination?.pages,
          nextPage: json?.data?.pagination?.page + 1,
        }
      } catch (error) {
        console.error('❌ Error fetching messages:', error)
        return { messages: [], hasMore: false, nextPage: 1 }
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined
    },
    enabled: !!roomId && !!accessToken,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    retryDelay: 1000,
    initialPageParam: 1,
  })

  // ✅ Flatten all messages from all pages (oldest first for display)
  const allMessages =
    data?.pages
      .flatMap((page) => page.messages)
      .filter((message) => getMessageRoomId(message) === roomId) || []

  // 🔌 Optimized room joining/leaving
  useEffect(() => {
    if (!socket || !isConnected || !roomId) return

    const joinRoom = async () => {
      if (currentRoomRef.current !== roomId) {
        // Leave previous room
        if (currentRoomRef.current) {
          socket.emit('leaveRoom', currentRoomRef.current)
          console.log('🚪 Left room:', currentRoomRef.current)

          // Clear previous room messages from cache
          queryClient.removeQueries({
            queryKey: ['messages', currentRoomRef.current],
          })
        }

        // Join new room
        socket.emit('joinRoom', roomId)
        console.log('🚀 Joined room:', roomId)
        currentRoomRef.current = roomId
      }
    }

    joinRoom()
  }, [socket, isConnected, roomId, accessToken, queryClient])

  // 📡 Optimized socket listeners with useCallback
  const handleNewMessage = useCallback(
    (msg: Message) => {
      console.log('📨 New message received:', {
        messageId: msg._id,
        senderId: msg.sender._id,
        room: msg.chatRoom,
        currentRoom: currentRoomRef.current,
      })

      const targetRoom = getMessageRoomId(msg)

      // Only update if this message is for the current room
      if (!targetRoom || targetRoom !== currentRoomRef.current) {
        console.log('⚠️ Message for different room, skipping update')
        return
      }

      queryClient.setQueryData(
        ['messages', targetRoom],
        (
          old:
            | { pages: Array<{ messages: Message[] }>; pageParams: number[] }
            | undefined
        ) => {
          if (!old || !old.pages.length) {
            return {
              pages: [{ messages: [msg], hasMore: false, nextPage: 1 }],
              pageParams: [1],
            }
          }

          // Add new message to the LAST page (newest messages)
          const updatedPages = [...old.pages]
          const lastPageIndex = updatedPages.length - 1
          updatedPages[lastPageIndex] = {
            ...updatedPages[lastPageIndex],
            messages: [...updatedPages[lastPageIndex].messages, msg],
          }

          return {
            ...old,
            pages: updatedPages,
          }
        }
      )
    },
    [queryClient]
  )

  // ✅ Fixed message edit handler
  const handleMessageEdited = useCallback(
    (editedMessage: Message) => {
      console.log('✏️ Message edited:', editedMessage._id)
      const targetRoom = getMessageRoomId(editedMessage)

      // Only update if this message is for the current room
      if (!targetRoom || targetRoom !== currentRoomRef.current) {
        console.log('⚠️ Edited message for different room, skipping update')
        return
      }

      queryClient.setQueryData(
        ['messages', targetRoom],
        (old: { pages: Array<{ messages: Message[] }> } | undefined) => {
          if (!old) return old

          const updatedPages = old.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) =>
              m._id === editedMessage._id ? editedMessage : m
            ),
          }))

          console.log('✅ Message updated in cache')
          return {
            ...old,
            pages: updatedPages,
          }
        }
      )
    },
    [queryClient]
  )

  // ✅ Fixed message delete handler
  const handleMessageDeleted = useCallback(
    (data: { messageId: string; chatRoom: string }) => {
      console.log('🗑️ Message deleted:', data.messageId)
      const targetRoom = data.chatRoom

      // Only update if this message is for the current room
      if (targetRoom !== currentRoomRef.current) {
        console.log('⚠️ Deleted message for different room, skipping update')
        return
      }

      queryClient.setQueryData(
        ['messages', targetRoom],
        (old: { pages: Array<{ messages: Message[] }> } | undefined) => {
          if (!old) return old

          const updatedPages = old.pages.map((page) => ({
            ...page,
            messages: page.messages.filter((m) => m._id !== data.messageId),
          }))

          console.log('✅ Message removed from cache')
          return {
            ...old,
            pages: updatedPages,
          }
        }
      )
    },
    [queryClient]
  )

  // 📡 Attach optimized socket listeners
  useEffect(() => {
    if (!socket || !isConnected) return

    console.log('🔌 Setting up socket listeners...')

    socket.on('message:new', handleNewMessage)
    socket.on('message:edited', handleMessageEdited)
    socket.on('message:deleted', handleMessageDeleted)

    return () => {
      console.log('🧹 Cleaning up socket listeners...')
      socket.off('message:new', handleNewMessage)
      socket.off('message:edited', handleMessageEdited)
      socket.off('message:deleted', handleMessageDeleted)
    }
  }, [
    socket,
    isConnected,
    handleNewMessage,
    handleMessageEdited,
    handleMessageDeleted,
  ])

  return {
    messages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading: isLoading || isFetching,
    isConnected,
  }
}
