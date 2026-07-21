'use client'

import { useEffect, useRef } from 'react'
import { useUserStore } from '@/zustand/useUserStore'
import { useSocketStore } from '@/zustand/socketStore'
import { Session } from 'next-auth'

interface Props {
  session: Session | null
}

export default function ClientProvider({ session }: Props) {
  const { setUser, clearUser } = useUserStore()
  const { connectSocket, disconnectSocket } = useSocketStore()
  const initializedRef = useRef(false)

  useEffect(() => {
    const userId = session?.user?.id

    if (userId && !initializedRef.current) {
      // ✅ Set user data in store
      setUser({
        id: userId,
        firstName: session.user.firstName || '',
        lastName: session.user.name || '',
        email: session.user.email || '',
        profileImage: session.user.image || '',
        accessToken: session.user.accessToken || '',
        role: session.user.role || '',
      })

      // ✅ Connect socket once
      connectSocket(userId)
      initializedRef.current = true
      console.log('✅ User initialized:', userId)
    }

    if (!userId && initializedRef.current) {
      // ✅ Only clear when user actually logs out
      clearUser()
      disconnectSocket()
      initializedRef.current = false
      console.log('❌ User logged out')
    }

    // ⚠️ NO cleanup here - let it persist across re-renders
  }, [session?.user?.id]) // ✅ Only depend on userId changes

  return null
}
