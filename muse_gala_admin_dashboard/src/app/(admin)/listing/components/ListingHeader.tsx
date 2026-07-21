'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { InfoCard } from '@/components/cards/stat-card'


// Define response types
type ListingStatsResponse = {
  status: boolean
  message: string
  data: {
    totalListings: number
    totalApproved: number
    totalPending: number
  }
}

async function getListingStats(token: string): Promise<ListingStatsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/listings/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch listings stats')
  }

  return res.json()
}

export default function ListingHeader() {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken as string | undefined

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listingStats'],
    queryFn: () => {
      if (!accessToken) throw new Error('No access token available')
      return getListingStats(accessToken)
    },
    enabled: !!accessToken, // only fetch when token is available
  })

  const stats = data?.data

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl uppercase font-light tracking-[0.2em]">
          MANAGE LISTINGS
        </h1>
        
      </div>

      <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-lg">
        <InfoCard
          title="Total Listings"
          value={isLoading ? '...' : String(stats?.totalListings ?? 0)}
        />

        <InfoCard
          title="Pending Submissions"
          value={isLoading ? '...' : String(stats?.totalPending ?? 0)}
        />
        <InfoCard
          title="Approved Listings"
          value={isLoading ? '...' : String(stats?.totalApproved ?? 0)}
        />
        <InfoCard
          title="Needs Review"
          value={
            isLoading
              ? '...'
              : String(
                  (stats?.totalListings ?? 0) -
                    (stats?.totalApproved ?? 0) -
                    (stats?.totalPending ?? 0)
                )
          }
        />
      </div>

      {isError && (
        <p className="text-red-500 mt-3">Failed to load listings stats</p>
      )}
    </div>
  )
}
