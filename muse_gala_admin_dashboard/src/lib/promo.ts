// ==================== FILE: lib/promoApi.ts ====================
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export interface PromoCode {
  _id: string
  code: string
  discountType: 'PERCENTAGE' | 'FLAT'
  discount: number
  expiresAt: string
  selectedUsers: string[]
  maxUsage: number
  usedCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePromoPayload {
  code: string
  discountType: 'PERCENTAGE' | 'FLAT'
  discount: number
  expiresAt: string
  maxUsage: number
}

// Get all promo codes
export const useGetPromoCodes = (accessToken: string) => {
  return useQuery({
    queryKey: ['promo-codes'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/promo/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch promo codes')
      return res.json()
    },
    enabled: !!accessToken,
  })
}

// Get single promo code
export const useGetSinglePromo = (id: string, accessToken: string) => {
  return useQuery({
    queryKey: ['promo-code', id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/promo/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch promo code')
      return res.json()
    },
    enabled: !!accessToken && !!id,
  })
}

// Create promo code
export const useCreatePromo = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePromoPayload) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/promo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.message || 'Failed to create promo code')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] })
    },
  })
}

// Update promo code
export const useUpdatePromo = (id: string, accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: Partial<CreatePromoPayload> & { isActive?: boolean },
    ) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/promo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error?.message || 'Failed to update promo code')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] })
      queryClient.invalidateQueries({ queryKey: ['promo-code', id] })
    },
  })
}

// Delete promo code
export const useDeletePromo = (accessToken: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/promo/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to delete promo code')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] })
    },
  })
}

// Send to all users
export const useSendPromoToAll = (id: string, accessToken: string) => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/promo/${id}/send-email`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      if (!res.ok) throw new Error('Failed to send promo code')
      return res.json()
    },
  })
}

// Send to selected users
export const useSendPromoToSelected = (id: string, accessToken: string) => {
  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/promo/${id}/send-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userIds }),
        },
      )
      if (!res.ok) throw new Error('Failed to send promo code')
      return res.json()
    },
  })
}

// Get all users
export const useGetAllUsers = (accessToken: string) => {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v1/user/all-users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch users')
      const json = await res.json()
      return json.data || []
    },
    enabled: !!accessToken,
  })
}
