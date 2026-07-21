'use client'

import { Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useState, useMemo } from 'react'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversations: any[]
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
    if (!query) return text

    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(
      regex,
      `<span class="bg-yellow-200 font-medium">$1</span>`,
    )
  }

  // ✅ Filter conversations
  const filteredConversations = useMemo(() => {
    if (!debouncedSearch.trim()) return conversations

    const lower = debouncedSearch.toLowerCase()

    return conversations.filter(item => {
      const nameMatch = item.name?.toLowerCase().includes(lower)
      const timestampMatch = item.timestamp?.toLowerCase().includes(lower)

      return nameMatch || timestampMatch
    })
  }, [debouncedSearch, conversations])

  console.log('my conversations', conversations)

  return (
    <div className="w-full">
      {/* Search Row */}
      <div className="flex items-center justify-between gap-3 p-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-[#595959]" />
          <Input
            placeholder="Search messages..."
            className="pl-11 py-5 border-[#E6E6E6] focus-visible:ring-0 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="overflow-y-auto scrollbar-hide max-h-[400px] md:max-h-[544px]">
        {/* ✅ No Results Found */}
        {filteredConversations.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-sm">No results found for:</p>
            <p className="font-medium mt-1 text-gray-700">{debouncedSearch}</p>
          </div>
        )}

        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            className={`p-4 flex items-start gap-3 cursor-pointer rounded-lg hover:bg-gray-50/80 border-b ${
              activeConversation === conversation.id ? 'bg-slate-100' : ''
            }`}
            onClick={() => onSelect(conversation.id)}
          >
            <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
              <User className="h-5 w-5 text-gray-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center ">
                {/*  Highlighted Name */}
                {/* <p
                  className="font-normal tracking-wider text-[12px] md:text-sm"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(conversation.name, debouncedSearch),
                  }}
                /> */}
                <p className="font-normal tracking-wider text-[12px] md:text-sm">
                  {conversation.dressName}
                </p>

                <span className="text-xs text-gray-500">
                  {conversation.timestamp}
                </span>
              </div>

              {/* ✅ Highlighted preview */}
              <p
                className="text-sm mt-2 text-gray-500 truncate"
                dangerouslySetInnerHTML={{
                  __html: highlightText(conversation.preview, debouncedSearch),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
