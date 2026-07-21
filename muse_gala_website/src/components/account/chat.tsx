'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, User, Send } from 'lucide-react'

interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'support'
  timestamp: string
}

interface ChatConversation {
  id: string
  orderId: string
  preview: string
  timestamp: string
  messages: ChatMessage[]
}

export default function ChatSystem() {
  const [newMessage, setNewMessage] = useState('')
  const [activeConversation, setActiveConversation] = useState('1')

  const conversations: ChatConversation[] = [
    {
      id: '1',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [
        {
          id: '1',
          content: 'Hi, Mindy',
          sender: 'user',
          timestamp: '09:41 AM',
        },
        {
          id: '2',
          content: "I've tried the app",
          sender: 'user',
          timestamp: '09:41 AM',
        },
        {
          id: '3',
          content: 'Really?',
          sender: 'support',
          timestamp: '09:42 AM',
        },
      ],
    },
    {
      id: '2',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '3',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '4',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '5',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '6',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '7',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '8',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '9',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
    {
      id: '10',
      orderId: 'XXXXX',
      preview: 'Hi, I have a question...',
      timestamp: '10:15 AM',
      messages: [],
    },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    console.log('Sending message:', newMessage)
    setNewMessage('')
  }

  const activeChat = conversations.find(
    (conv) => conv.id === activeConversation
  )

  return (
    <div className="font-avenir px-4 sm:px-6 md:px-8 pb-5">
      <div className="flex flex-col md:flex-row md:h-[600px] gap-6 rounded-lg overflow-hidden mb-[100px]">
        {/* Left Panel - Conversation List */}
        <div className="w-full md:w-1/3">
          <div className="p-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#595959]" />
              <Input
                placeholder="SEARCH MESSAGE....."
                className="pl-11 py-4 border-[#E6E6E6] focus-visible:ring-0 text-sm"
              />
            </div>
          </div>
          <div className="overflow-y-auto scrollbar-hide max-h-[400px] md:max-h-[544px]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 border-b ${activeConversation === conversation.id ? 'bg-gray-100' : ''
                  }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">
                      Order #{conversation.orderId}
                    </p>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.preview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Area */}
        <div className="w-full md:w-2/3 flex flex-col">
          {/* Chat Header */}
          <div className="py-4 px-4 sm:px-7 border border-[#E6E6E6] rounded-full flex items-center gap-3">
            <div className="bg-gray-100 rounded-full p-2">
              <User className="h-6 w-6 sm:h-7 sm:w-7 text-gray-500" />
            </div>
            <p className="font-normal text-lg sm:text-2xl">
              Order #{activeChat?.orderId}
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col border-[#E6E6E6] border mt-5 rounded-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeChat?.messages.length ? (
                <>
                  <div className="text-center">
                    <span className="text-xs text-gray-400 bg-white px-2">
                      {activeChat.messages[0].timestamp}
                    </span>
                  </div>
                  {activeChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                        }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-4 py-2 ${message.sender === 'user'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No messages yet</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white">
              <div className="flex items-center gap-2">
                <input
                  placeholder="Type your message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage()
                  }}
                  className="rounded-full py-4 px-5 border w-full outline-none bg-white text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="rounded-full bg-black hover:bg-gray-800 p-4"
                >
                  <Send className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
