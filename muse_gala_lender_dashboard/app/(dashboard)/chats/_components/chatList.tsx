'use client'

import { Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  conversations: Array<{
    id: string
    name?: string
    email?: string
    orderId?: string
    dressName?: string
    timestamp?: string
    preview?: string
  }>
  activeConversation: string
  onSelect: (id: string) => void
}

export default function ChatList({
  conversations,
  activeConversation,
  onSelect,
}: Props) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // ✅ Debounce (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // ✅ Highlight function
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return String(text || '')
    try {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(${escapedQuery})`, 'gi')
      return String(text).replace(
        regex,
        `<span class="bg-yellow-200 font-semibold">$1</span>`
      )
    } catch (e) {
      void e
      return String(text)
    }
  }

  // ✅ Filter conversations (name + timestamp + preview)
  const filteredConversations = useMemo(() => {
    if (!debouncedSearch.trim()) return conversations

    const lower = debouncedSearch.toLowerCase()

    return conversations.filter((c) => {
      const lowerQuery = lower.trim()
      return (
        String(c.name || '').toLowerCase().includes(lowerQuery) ||
        String(c.email || '').toLowerCase().includes(lowerQuery) ||
        String(c.orderId || '').toLowerCase().includes(lowerQuery) ||
        String(c.dressName || '').toLowerCase().includes(lowerQuery) ||
        String(c.timestamp || '').toLowerCase().includes(lowerQuery) ||
        String(c.preview || '').toLowerCase().includes(lowerQuery)
      )
    })
  }, [debouncedSearch, conversations])

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-white">
      {/* ✅ Search Field */}
      <div className="border-b border-gray-100 bg-white px-4 pb-3 pt-2 md:px-4 md:pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages"
            className="h-11 rounded-md border-none bg-gray-100 pl-10 text-sm shadow-none outline-none placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#54051d]/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {/* ✅ Conversations */}
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-hide">
        {/* ✅ No Results Found */}
        {filteredConversations.length === 0 && (
          <div className="rounded-md border border-dashed border-gray-200 px-4 py-10 text-center text-gray-500">
            <p className="text-xs md:text-sm tracking-wide">No results found</p>
            <p className="font-semibold mt-1 text-gray-700 text-sm">
              {debouncedSearch}
            </p>
          </div>
        )}

        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 transition-colors active:bg-gray-100 md:hover:bg-gray-50 ${activeConversation === conversation.id ? 'bg-[#54051d]/10 ring-1 ring-[#54051d]/10' : ''
              }`}
            onClick={() => onSelect(conversation.id)}
          >
            <div className="relative shrink-0">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#f7f2ee] ring-1 ring-black/5 md:h-12 md:w-12">
                <User className="h-6 w-6 text-gray-500" />
              </div>
            </div>

            {/* Texts */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <p
                  className="truncate text-sm font-semibold text-gray-950"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(conversation.name, debouncedSearch),
                  }}
                />
                <span className="shrink-0 text-[10px] font-medium text-gray-400 md:text-xs">
                  {conversation.timestamp}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2 mt-0.5">
                <p
                  className={`flex-1 truncate text-xs md:text-sm ${activeConversation === conversation.id ? 'text-gray-800' : 'text-gray-500'
                    }`}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(conversation.preview, debouncedSearch),
                  }}
                />
              </div>

              {conversation.orderId && (
                <p
                  className="mt-1 truncate text-[9px] uppercase tracking-wide text-gray-400 md:text-[10px]"
                  dangerouslySetInnerHTML={{
                    __html: `${conversation.dressName
                      ? `${highlightText(conversation.dressName, debouncedSearch)} · `
                      : ''
                      }ID: ${highlightText(
                      conversation.orderId,
                      debouncedSearch
                    )}`,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
