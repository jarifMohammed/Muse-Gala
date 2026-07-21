/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { useConversations } from '@/hooks/useConversations'
import ChatLayout from '@/components/chat/chatLayout'
import { useUserStore } from '@/zustand/useUserStore'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchParams } from 'next/navigation'

interface Participant {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'LENDER'
}

interface Conversation {
  id: string
  dressName: string
  preview: string
  timestamp: string
  participants: Participant[]
  name: string
  status: string
  flagged: {
    status: boolean
    reason?: string
  }
}

interface Message {
  _id: string
  message: string
  sender: {
    _id: string
    firstName: string
    role?: 'USER' | 'LENDER'
  }
  attachments: Array<{
    url: string
    type: string
    fileName: string
    size: number
    mimeType: string
  }>
  createdAt: string
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const chatIdFromUrl = searchParams.get('id')
  const [activeConversation, setActiveConversation] = useState<string>('')

  const { user } = useUserStore()

  const {
    data: conversationsResponse,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations()

  const {
    messages,
    isLoading: messagesLoading,
    isConnected,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch: refetchMessages,
  } = useChat(activeConversation)

  // ✅ Format conversations properly
  const conversations: Conversation[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conversationsResponse?.data?.data?.map((conv: any) => {
      const chatPartner = conv.participants.find(
        (p: Participant) => p._id !== user?.id,
      )

      const name = chatPartner
        ? `${chatPartner.firstName || ''} ${chatPartner.lastName || ''}`.trim()
        : 'Unknown'

      return {
        id: conv._id,
        dressName: conv.bookingId?.masterdressId?.dressName || 'Unknown Dress',
        preview: conv.lastMessage || 'No messages yet',
        timestamp: new Date(
          conv.lastMessageAt || conv.updatedAt,
        ).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        participants: conv.participants,
        name,
        status: conv.status, // ✅ add this
        flagged: conv.flagged || { status: false }, // ✅ add this
      }
    }) || []

  useEffect(() => {
    if (conversations.length > 0) {
      if (chatIdFromUrl && conversations.some(c => c.id === chatIdFromUrl)) {
        setActiveConversation(chatIdFromUrl)
      } else if (!activeConversation) {
        setActiveConversation(conversations[0].id)
      }
    }
  }, [conversations, activeConversation, chatIdFromUrl])

  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id)
    if (id) await refetchMessages()
  }

  const formattedMessages: Message[] = messages.map(msg => ({
    _id: msg._id,
    message: msg.message,
    sender: {
      _id: msg.sender._id,
      firstName: msg.sender.firstName,
      role: (msg.sender as { role?: 'USER' | 'LENDER' }).role,
    },
    attachments: msg.attachments || [],
    createdAt: msg.createdAt,
  }))

  if (conversationsLoading) {
    return <ChatSkeleton />
  }

  if (conversationsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading conversations</p>
          <button
            onClick={() => refetchConversations()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!conversations.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No conversations found</p>
          <p className="text-gray-400 text-sm">
            Start a conversation to see it here!
          </p>
        </div>
      </div>
    )
  }

  return (
    <ChatLayout
      conversations={conversations}
      activeConversation={activeConversation}
      onSelect={handleSelectConversation}
      messages={formattedMessages}
      isLoading={messagesLoading}
      isConnected={isConnected}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  )
}
const ChatSkeleton = () => {
  return (
    <div className="flex h-[600px] w-full border border-gray-200 bg-white">
      {/* Sidebar Skeleton */}
      <div className="w-1/3 border-r border-gray-200 p-4 space-y-4">
        <Skeleton className="h-8 w-3/4 mb-6" />
        {['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5'].map((key) => (
          <div key={key} className="flex gap-3 items-center">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex items-center gap-4 border-b pb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex-1 space-y-6 py-6">
          <Skeleton className="h-12 w-1/2 ml-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl" />
          <Skeleton className="h-12 w-2/3 mr-auto rounded-tl-xl rounded-tr-xl rounded-br-xl" />
          <Skeleton className="h-12 w-1/3 ml-auto rounded-tl-xl rounded-tr-xl rounded-bl-xl" />
        </div>
        <div className="border-t pt-4">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
