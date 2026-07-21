// ==================== FILE: lib/dashboardApi.ts ====================
import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export interface DashboardStats {
  totalRevenue: number
  activeLenders: number
  activeBookings: number
  pendingDisputes: number
  bookingVolume: {
    active: number
    completed: number
    cancelledOrPending: number
  }
  disputeResolution: {
    pending: number
    escalated: number
    resolved: number
  }
}

export interface RevenueTrend {
  month: string
  value: number
}

export interface TopLender {
  totalBookings: number
  revenue: number
  pendingOrCancel: number
  id: string
  name?: string
  email: string
}

export interface TopDress {
  totalBookings: number
  revenue: number
  pendingOrCancel: number
  masterDressDbId: string
  masterDressId: string
  dressName: string
  lenderId: string
  lenderName?: string
  lenderEmail: string
}

export interface LenderStats {
  totalLenders: number
  activeLenders: number
  pendingApplications: number
  approvedLenders: number
}

// Fetch Dashboard Stats
export const useGetDashboardStats = (
  accessToken: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['dashboard-stats', startDate, endDate],
    queryFn: async () => {
      let url = `${API_BASE_URL}/api/v1/admin/overview/dashboard/stats`

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch dashboard stats')
      return res.json()
    },
    enabled: !!accessToken,
  })
}

// Fetch Revenue Trends
export const useGetRevenueTrends = (
  accessToken: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['revenue-trends', startDate, endDate],
    queryFn: async () => {
      let url = `${API_BASE_URL}/api/v1/admin/overview/dashboard/revenue-trends`

      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch revenue trends')
      return res.json()
    },
    enabled: !!accessToken,
  })
}

// Fetch Top Lenders
export const useGetTopLenders = (
  accessToken: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ['top-lenders', page, limit],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/overview/dashboard/top-lenders?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch top lenders')
      return res.json()
    },
    enabled: !!accessToken,
  })
}

// Fetch Top Dresses
export const useGetTopDresses = (
  accessToken: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: ['top-dresses', page, limit],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/overview/dashboard/top-dresses?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch top dresses')
      return res.json()
    },
    enabled: !!accessToken,
  })
}

// Fetch Lender Stats
export const useGetLenderStats = (accessToken: string) => {
  return useQuery({
    queryKey: ['lender-stats'],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/admin/overview/lender-stats`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      if (!res.ok) throw new Error('Failed to fetch lender stats')
      return res.json()
    },
    enabled: !!accessToken,
  })
}
