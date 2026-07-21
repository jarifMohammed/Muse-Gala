'use client'

import { useMemo, useState } from 'react'
import ChatList from './chatList'
import ChatHeader from './chatHeader'
import ChatMessages from './chatMessages'
import ChatInput from './chatInput'
import { useSendMessage } from '@/hooks/useSendMessage'
import { useUserStore } from '@/zustand/useUserStore'
import { useSession } from 'next-auth/react'
// import { Button } from '@/components/ui/button'
// import { Menu, X } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  console.log(isSidebarOpen)

  const currentUserId = user?.id || session?.user?.id

  const handleSelectConversation = async (id: string) => {
    setLocalLoading(true)
    await onSelect(id)
    setIsSidebarOpen(false)
    setTimeout(() => setLocalLoading(false), 300)
  }

  const formattedMessages = useMemo(() => {
    if (!currentUserId || !messages.length) return []
    return messages.map((m) => ({
      id: m._id,
      content: m.message,
      sender: m.sender._id === currentUserId,
      timestamp: m.createdAt,
      rawSenderId: m.sender._id,
      attachments: m.attachments,
    }))
  }, [messages, currentUserId])

  const handleSendMessage = async (text: string, file?: File) => {
    if (!activeConversation || (!text.trim() && !file)) return
    sendMessage({
      text: text?.trim(),
      chatRoom: activeConversation,
      file,
    })
  }

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading user data...</p>
        </div>
      </div>
    )
  }

  const activeChat = conversations.find((c) => c.id === activeConversation)
  const isClosed = activeChat?.status === 'closed'
  // const isFlagged = activeChat?.flagged?.status

  return (
    <div className="font-avenir pb-5 relative">
      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
          Connecting to chat...
        </div>
      )}

      <div className="flex flex-col md:flex-row md:h-[600px] lg:h-[700px] gap-4 rounded-lg overflow-hidden relative">
        {/* Sidebar */}
        <div className="hidden md:block w-1/3">
          <ChatList
            conversations={conversations}
            activeConversation={activeConversation}
            onSelect={handleSelectConversation}
          />
        </div>

        {/* Main Chat */}
        <div className="w-full md:w-2/3 flex flex-col border border-[#E6E6E6] rounded-xl bg-white shadow-sm">
          <ChatHeader name={activeChat?.name} dressName={activeChat?.dressName} />

          <div className="flex-1 flex flex-col overflow-hidden h-[60vh] md:h-auto">
            {(isLoading || localLoading) && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-gray-500">
                  Loading messages...
                </span>
              </div>
            )}

            <ChatMessages
              messages={formattedMessages}
              currentUserId={currentUserId}
              chatRoomId={activeConversation}
              isLoading={isLoading || localLoading}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />

            {/* ✅ Closed / Flagged logic here */}
            <div className="border-t">
              {isClosed ? (
                <div className="flex items-center justify-center py-4 text-gray-500 text-sm">
                  This conversation has been closed and cannot receive new
                  messages.
                </div>
              ) : (
                <ChatInput
                  onSend={handleSendMessage}
                  disabled={isSending || !isConnected}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
