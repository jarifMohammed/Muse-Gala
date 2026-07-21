'use client'

import AccountInfo from '@/components/account/account_info'
import MuseClub from '@/components/account/muse_club'
import OrderHistory from '@/components/account/order_history'
import YourWishlist from '@/components/account/your_wishlist'
import DocumentVerification from './_components/document-verification'
import { useUserStore } from '@/zustand/useUserStore'

const AllAccountInfo = () => {
  const { user } = useUserStore()

  return (
    <div className="container mx-auto">
      <DocumentVerification user={user} />
      <div className="flex flex-col gap-[50px] md:gap-[80px] lg:gap-[100px] mt-6">
        <AccountInfo />
        {user?.role?.toLowerCase() === 'user' && (
          <>
            <MuseClub />
            <OrderHistory />
            <YourWishlist />
          </>
        )}
      </div>
    </div>
  )
}

export default AllAccountInfo
