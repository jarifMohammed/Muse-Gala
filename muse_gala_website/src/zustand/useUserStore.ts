import { create } from 'zustand'

export interface User {
  id: string
  firstName?: string
  lastName?: string
  role?: string
  email?: string
  profileImage?: string
  accessToken?: string
  phoneNumber?: string
  bio?: string
  kycVerified?: boolean
  kycStatus?: string
  totalSpent?: number
  firstBookingDiscountUsed?: boolean
  spent300DiscountUsed?: boolean
  spent600DiscountUsed?: boolean
}

interface UserState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
