'use client'

import AccountInfo from '@/components/account/account_info'
// import Dispute from '@/components/account/dispute_components'
import MuseClub from '@/components/account/muse_club'
import OrderHistory from '@/components/account/order_history'
import YourWishlist from '@/components/account/your_wishlist'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Headers from './headers'
import DocumentVerification from './document-verification'
import { useUserStore } from '@/zustand/useUserStore'
import Disputes from '../dispute/_components/dispute'

const AllAccountInfo = () => {
  const [tab, setTab] = useState('Account Info')
  const router = useRouter()
  const { user } = useUserStore()

  // ✅ "Chats" ট্যাব সিলেক্ট হলে redirect করবে
  useEffect(() => {
    if (tab === 'Chats') {
      router.push('/account/chats')
    }
  }, [tab, router])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-600 text-lg">
          Please log in to view your account.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <Headers setTab={setTab} tab={tab} user={user} />

      {/* Document verification alert */}
      <div className="mb-10">
        <DocumentVerification user={user} />
      </div>

      {tab === 'Account Info' && (
        <div className="flex flex-col gap-[100px]">
          <AccountInfo />
          <MuseClub />
          <OrderHistory />
          <YourWishlist />
        </div>
      )}

      {tab === 'Dispute' && (
        <div>
          <Disputes token={user?.accessToken || ''} />
        </div>
      )}
    </div>
  )
}

export default AllAccountInfo
