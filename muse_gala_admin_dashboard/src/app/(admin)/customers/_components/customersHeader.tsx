'use client'

import { InfoCard } from '@/components/cards/stat-card'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

interface StatsResponse {
  status: boolean
  message: string
  data: {
    totalCustomers: number
    totalBookings: number
    totalPendingVerifications: number
  }
}

const CustomersHeader = () => {
  const cu = useSession()
  const accessToken = cu?.data?.user?.accessToken || ''
  // ------------------------------
  // Fetch Function
  // ------------------------------
  const fetchStats = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customer/customer-stats`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    const json: StatsResponse = await res.json()

    if (!json.status) {
      throw new Error('Failed to fetch customer stats')
    }

    return json.data
  }

  // ------------------------------
  // React Query
  // ------------------------------
  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-stats', accessToken],
    queryFn: fetchStats,
    enabled: !!accessToken,
  })

  return (
    <div>
      {/* Header Title + Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl uppercase font-light tracking-[.2em]">
          MANAGE CUSTOMERS
        </h1>

        
      </div>

      {/* Cards */}
      <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
        {isLoading ? (
          <>
            <InfoCard title="Total Customers" value="Loading..." />
            <InfoCard title="Total Bookings" value="Loading..." />
            <InfoCard title="Pending verifications" value="Loading..." />
          </>
        ) : error ? (
          <>
            <InfoCard title="Total Customers" value="Error" />
            <InfoCard title="Total Bookings" value="Error" />
            <InfoCard title="Pending verifications" value="Error" />
          </>
        ) : (
          <>
            <InfoCard
              title="Total Customers"
              value={data?.totalCustomers.toString() || '0'}
            />

            <InfoCard
              title="Total Bookings"
              value={data?.totalBookings.toString() || '0'}
            />

            <InfoCard
              title="Pending verifications"
              value={data?.totalPendingVerifications.toString() || '0'}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default CustomersHeader
