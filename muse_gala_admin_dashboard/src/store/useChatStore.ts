// /store/useChatStore.ts
'use client'

import { create } from 'zustand'

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
  chatRoom: string
  sender: Sender
  message: string
  attachments: Attachment[]
  readBy: string[]
  createdAt: string
  updatedAt: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

interface ChatState {
  messages: Message[]
  page: number
  hasMore: boolean
  isLoading: boolean
  isFetchingMore: boolean
  error: string | null
  reset: () => void
  fetchMessages: (
    chatId: string,
    token: string,
    page?: number,
    loadMore?: boolean
  ) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  page: 1,
  hasMore: false,
  isLoading: false,
  isFetchingMore: false,
  error: null,

  reset: () => {
    set({
      messages: [],
      page: 1,
      hasMore: false,
      isLoading: false,
      isFetchingMore: false,
      error: null,
    })
  },

  fetchMessages: async (chatId, token, page = 1, loadMore = false) => {
    const state = get()

    if (loadMore) {
      set({ isFetchingMore: true })
    } else {
      set({ isLoading: true })
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/${chatId}/?page=${page}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!res.ok) throw new Error(`Failed: ${res.status}`)

      const json = await res.json()
      const newMessages: Message[] = json.data.messages
      const pagination: Pagination = json.data.pagination

      // Maintain ascending order (oldest first → newest last)
      if (loadMore) {
        // Older messages loaded → prepend
        set({
          messages: [...newMessages.reverse(), ...state.messages],
          page: pagination.page,
          hasMore: pagination.page < pagination.pages,
        })
      } else {
        // First load → newest last
        set({
          messages: newMessages.reverse(),
          page: pagination.page,
          hasMore: pagination.page < pagination.pages,
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch messages' })
    } finally {
      set({ isLoading: false, isFetchingMore: false })
    }
  },
}))
