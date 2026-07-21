/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect, useRef } from 'react'

import { useUserStore } from '@/zustand/useUserStore'
import { useConversations } from '@/hooks/useConversations'
import { useChat } from '@/hooks/useChat'
import ChatLayout from './chatLayout'
import { useRouter, useSearchParams } from 'next/navigation'

interface Participant {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'LENDER'
}

interface Conversation {
  id: string
  orderId: string
  dressName: string
  preview: string
  timestamp: string
  participants: Participant[]
  name: string // 🆕 person you're chatting with
  email: string // 🆕 person you're chatting with email
}

interface Message {
  _id: string
  chatRoom?: string | { _id?: string }
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatIdFromUrl = searchParams.get('id') || ''
  const [activeConversation, setActiveConversation] = useState<string>('')
  const appliedUrlChatIdRef = useRef<string>('')

  // ✅ Get current logged-in user
  const { user } = useUserStore()

  const {
    data: conversationsResponse,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations()

  // ✅ Use the updated useChat hook with infinite scroll
  const {
    messages,
    isLoading: messagesLoading,
    isConnected,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChat(activeConversation)

  // ✅ Format conversations properly
  const conversations: Conversation[] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conversationsResponse?.data?.data?.map((conv: any) => {
      // Identify the participant who is NOT the logged-in user
      const chatPartner = conv.participants.find(
        (p: Participant) => p._id !== user?.id
      )

      const name = chatPartner
        ? `${chatPartner.firstName || ''} ${chatPartner.lastName ? `${chatPartner.lastName.charAt(0)}.` : ''}`.trim()
        : 'Unknown'
      const booking = conv.bookingId

      return {
        id: conv._id,
        orderId:
          typeof booking === 'object'
            ? booking?._id || JSON.stringify(booking)
            : booking,
        dressName:
          typeof booking === 'object'
            ? booking?.dressName ||
            booking?.listing?.dressName ||
            booking?.masterdressId?.dressName ||
            booking?.masterdressId?.name ||
            ''
            : '',
        preview: conv.lastMessage || 'No messages yet',
        timestamp: new Date(
          conv.lastMessageAt || conv.updatedAt
        ).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        participants: conv.participants,
        name,
        email: chatPartner?.email || '',
        status: conv.status, // ✅ add this
        flagged: conv.flagged || { status: false }, // ✅ add this
      }
    }) || []

  // ✅ Open a chat directly when routed from a booking action
  useEffect(() => {
    if (chatIdFromUrl && appliedUrlChatIdRef.current !== chatIdFromUrl) {
      appliedUrlChatIdRef.current = chatIdFromUrl
      setActiveConversation(chatIdFromUrl)
      refetchConversations()
    }
  }, [chatIdFromUrl, refetchConversations])

  // ✅ Set first conversation active by default (Desktop only)
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation && !chatIdFromUrl) {
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        setActiveConversation(conversations[0].id);
      }
    }
  }, [conversations, activeConversation, chatIdFromUrl]);

  const handleSelectConversation = async (id: string) => {
    appliedUrlChatIdRef.current = id
    setActiveConversation(id)
    router.replace(id ? `/chats?id=${id}` : '/chats', { scroll: false })
  }

  // ✅ Format messages with attachments
  const formattedMessages: Message[] = messages.map((msg) => ({
    _id: msg._id,
    chatRoom: msg.chatRoom,
    message: msg.message,
    sender: {
      _id: msg.sender._id,
      firstName: msg.sender.firstName,
      role: (msg.sender as { role?: 'USER' | 'LENDER' }).role,
    },
    attachments: msg.attachments || [],
    createdAt: msg.createdAt,
  }))

  // ✅ Handle loading & error UI
  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    )
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

  if (!conversations.length && !chatIdFromUrl) {
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
    <div className={`flex min-h-0 flex-1 flex-col px-0 md:px-0 ${activeConversation ? 'overflow-hidden' : ''}`}>
      <div className={`${activeConversation ? 'hidden md:block' : 'block'} shrink-0 bg-white px-4 py-4 md:bg-transparent md:px-0 md:pb-5 md:pt-8`}>
        <h2 className="text-xl font-semibold tracking-tight text-gray-950 md:text-3xl md:font-light md:tracking-widest">
          {activeConversation ? 'Chats' : 'Messages'}
        </h2>
      </div>
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
    </div>
  )
}
