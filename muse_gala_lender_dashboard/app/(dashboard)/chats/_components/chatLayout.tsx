'use client'

import { useMemo, useState } from 'react'
import { useSendMessage } from '@/hooks/useSendMessage'
import { useUserStore } from '@/zustand/useUserStore'
import { useSession } from 'next-auth/react'
import ChatInput from './chatInput'
import ChatMessages from './chatMessages'
import ChatHeader from './chatHeader'
import ChatList from './chatList'

interface Attachment {
  url: string
  type: string
  fileName: string
  size: number
  mimeType: string
}

interface ChatLayoutProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversations: any[]
  activeConversation: string
  onSelect: (id: string) => void
  messages: {
    _id: string
    chatRoom?: string | { _id?: string }
    message: string
    sender: {
      _id: string
      firstName: string
      role?: 'USER' | 'LENDER'
    }
    attachments: Attachment[]
    createdAt: string
  }[]
  isLoading?: boolean
  isConnected?: boolean
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export default function ChatLayout({
  conversations,
  activeConversation,
  onSelect,
  messages,
  isLoading = false,
  isConnected = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
}: ChatLayoutProps) {
  const { mutate: sendMessage, isPending: isSending } = useSendMessage()
  const { data: session } = useSession()
  const { user } = useUserStore()
  const [localLoading, setLocalLoading] = useState(false)

  // ✅ Get current user ID
  const currentUserId = user?.id || session?.user?.id

  // ✅ Get active conversation object
  const activeConv = conversations.find(c => c.id === activeConversation)
  const isClosed = activeConv?.status === 'closed'
  // const isFlagged = activeConv?.flagged?.status === true

  // 🔄 Handle conversation switch with loading state
  const handleSelectConversation = async (id: string) => {
    setLocalLoading(true)
    await onSelect(id)
    setTimeout(() => setLocalLoading(false), 300)
  }

  // 🧠 Optimized message formatting
  const formattedMessages = useMemo(() => {
    if (!currentUserId || !messages.length) return []
    return messages
      .filter((m) => {
        const messageRoomId =
          typeof m.chatRoom === 'string' ? m.chatRoom : m.chatRoom?._id
        return !messageRoomId || messageRoomId === activeConversation
      })
      .map(m => ({
        id: m._id,
        content: m.message,
        sender: m.sender._id === currentUserId,
        timestamp: m.createdAt,
        rawSenderId: m.sender._id,
        attachments: m.attachments,
      }))
  }, [messages, currentUserId, activeConversation])

  // 📨 Message sending
  const handleSendMessage = async (text: string, file?: File) => {
    if (!activeConversation || (!text.trim() && !file)) return

    sendMessage({
      text: text.trim(),
      chatRoom: activeConversation,
      file,
    })
  }

  // ⏳ Loading state for user data
  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans h-full min-h-0 px-0 md:px-0">
      {!isConnected && (
        <div className="mx-4 mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 md:mx-0">
          Connecting to chat. Messages still send through the API.
        </div>
      )}

      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white md:h-[min(720px,calc(100vh-220px))] md:flex-row md:gap-5 md:rounded-lg md:border md:border-gray-200 md:bg-white md:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        {/* ✅ Sidebar - Hidden on mobile if a conversation is active */}
        <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} h-full min-h-0 w-full flex-col md:w-[360px] md:flex-none md:border-r md:border-gray-100`}>
          <ChatList
            conversations={conversations}
            activeConversation={activeConversation}
            onSelect={handleSelectConversation}
          />
        </div>

        {/* ✅ Main Chat Window - Hidden on mobile if no conversation is active */}
        <div className={`${activeConversation ? 'flex' : 'hidden md:flex'} h-full min-h-0 w-full flex-1 flex-col bg-white`}>
          <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
            <ChatHeader
              name={activeConv?.name}
              orderId={activeConv?.orderId}
              dressName={activeConv?.dressName}
              onBack={() => onSelect('')}
            />

            {/* ✅ Messages */}
            {(isLoading || localLoading) && (
              <div className="flex items-center justify-center border-b border-gray-100 bg-white px-4 py-3">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-[#54051d]"></div>
                <span className="ml-2 text-xs font-medium text-gray-500">
                  Loading messages...
                </span>
              </div>
            )}

            <ChatMessages
              key={activeConversation}
              messages={formattedMessages}
              currentUserId={currentUserId}
              chatRoomId={activeConversation}
              isLoading={isLoading || localLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />

            {/* ✅ Closed or Flagged Conversation Logic */}
            <div className="border-t border-gray-100 bg-white">
              {isClosed ? (
                <div className="flex items-center justify-center px-4 py-4 text-sm text-gray-500">
                  This conversation has been closed.
                </div>
              ) : (
                <ChatInput
                  onSend={handleSendMessage}
                  disabled={isSending}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
