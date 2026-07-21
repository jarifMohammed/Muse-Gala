import React from 'react'
import ChatPage from './_components/chatpage'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const page = () => {
  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col overflow-hidden bg-white md:h-auto md:min-h-[calc(100vh-96px)] md:bg-transparent md:p-10 md:pb-0">
      <div className="shrink-0 border-b border-gray-100 bg-white px-4 py-3 md:border-none md:bg-transparent md:px-0 md:pb-0 md:pt-0">
        <Link
          href="/bookings"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-[#54051d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Bookings
        </Link>
      </div>
      <ChatPage />
    </div>
  )
}

export default page
