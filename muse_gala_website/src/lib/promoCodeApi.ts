// ==================== FILE: lib/userPromoApi.ts ====================
import { useQuery } from '@tanstack/react-query'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export interface UserPromoCode {
  _id: string
  code: string
  discountType: 'PERCENTAGE' | 'FLAT'
  discount: number
  expiresAt: string
  maxUsage: number
  usedCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PromoUsage {
  bookingId: string
  promoCodeName: string
  promoCodeDiscount: number
  userName: string
  userEmail: string
  discountApplied: number
  usedAt: string
  expireAt: string
  createAt: string
}

export interface UserPromoResponse {
  success: boolean
  message: string
  totalIssuedDiscount: number
  totalDiscountGiven: number
  data: UserPromoCode[]
  usageData: PromoUsage[]
}

// Get user-specific promo codes
export const useGetUserPromoCodes = (accessToken: string) => {
  return useQuery({
    queryKey: ['user-promo-codes'],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/admin/promo/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch promo codes')
      return res.json() as Promise<UserPromoResponse>
    },
    enabled: !!accessToken,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

// Get single promo code details
export const useGetSingleUserPromo = (id: string, accessToken: string) => {
  return useQuery({
    queryKey: ['user-promo-code', id],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/v1/admin/promo/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch promo code')
      return res.json()
    },
    enabled: !!accessToken && !!id,
  })
}
