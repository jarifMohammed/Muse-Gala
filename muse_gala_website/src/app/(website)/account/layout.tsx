'use client'

import { ReactNode, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Headers from './_components/headers'
import { useUserStore } from '@/zustand/useUserStore'

interface LayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: LayoutProps) {
  const [tab, setTab] = useState('Account Info')
  const pathname = usePathname()
  const { user } = useUserStore()

  // Automatically set active tab based on route
  useEffect(() => {
    if (pathname.includes('/chats')) setTab('Chats')
    else if (pathname.includes('/dispute')) setTab('Dispute')
    else if (pathname.includes('/promo-codes')) setTab('Promo Codes')
    else setTab('Account Info')
  }, [pathname])

  return (
    <div className="w-full pt-12 md:pt-16 lg:pt-20">
      <Headers setTab={setTab} tab={tab} user={user} />
      <div>{children}</div>
    </div>
  )
}
