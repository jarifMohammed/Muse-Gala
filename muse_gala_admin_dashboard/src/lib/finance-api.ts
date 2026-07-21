import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export interface RefundAnalyticsData {
    success: boolean
    message: string
    summary: {
        totalRefundedBookings: number
        totalRefundAmount: number
        avgRefundAmount: number
        totalRefundTransactions: number
    }
    byStatus: Array<{ status: string; count: number; totalAmount: number }>
    byReason: Array<{ reason: string; count: number; totalAmount: number }>
    byType: Array<{ refundType: string; count: number; totalAmount: number }>
    monthlyTrend: Array<{
        month: string
        count: number
        totalAmount: number
    }>
    refunds: {
        data: Array<{
            bookingId: string
            customerName: string
            customerEmail: string
            dressName: string
            brand: string
            originalAmount: number
            paymentStatus: string
            totalRefunded: number
            refundDetails: Array<{
                stripeRefundId: string
                reason?: string
                refundType?: string
                processedBy?: string
            }>
            bookingDate: string
        }>
        pagination: {
            currentPage: number
            itemsPerPage: number
            totalItems: number
            totalPages: number
        }
    }
}

export const useGetRefundAnalytics = (
    accessToken: string,
    filters: {
        page?: number
        limit?: number
        startDate?: string
        endDate?: string
        status?: string
        reason?: string
    } = {}
) => {
    return useQuery<RefundAnalyticsData>({
        queryKey: ['refund-analytics', filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (filters.page) params.append('page', filters.page.toString())
            if (filters.limit) params.append('limit', filters.limit.toString())
            if (filters.startDate) params.append('startDate', filters.startDate)
            if (filters.endDate) params.append('endDate', filters.endDate)
            if (filters.status) params.append('status', filters.status)
            if (filters.reason) params.append('reason', filters.reason)

            const url = `${API_BASE_URL}/api/v1/admin/overview/dashboard/finance/refund-analytics?${params.toString()}`

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            if (!res.ok) throw new Error('Failed to fetch refund analytics')
            const json = await res.json()
            return json
        },
        enabled: !!accessToken,
    })
}
