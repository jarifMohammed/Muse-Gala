'use client'

import { InfoCard } from '@/components/cards/stat-card'
import { useQuery } from '@tanstack/react-query'

import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/custom/skeleton'

// fetcher function

async function fetchActiveCounts({ accessToken }: { accessToken: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/testimonoal/active-counts`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch active counts')
  }

  return res.json()
}

export default function ContainerHeader() {
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''
  const { data, isLoading, isError } = useQuery({
    queryKey: ['active-counts'],
    queryFn: () => fetchActiveCounts({ accessToken }),
  })

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-start">
        <h1 className="text-2xl uppercase md:text-[32px] font-light tracking-[0.2em]">
          CONTENT & CMS
        </h1>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-6 shadow-sm space-y-4"
            >
              <Skeleton className="h-6 w-3/4" /> {/* title placeholder */}
              <Skeleton className="h-8 w-1/3" /> {/* value placeholder */}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-red-500 mt-3 text-center">Failed to load stats</p>
      )}

      {/* Stats Grid */}
      {!isLoading && !isError && (
        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-lg">
          <InfoCard
            title="Active Homepage Sections"
            value={data?.data?.homepageSections ?? 0}
          />
          <InfoCard title="Active Banners" value={data?.data?.banners ?? 0} />
          <InfoCard
            title="Published Testimonials"
            value={data?.data?.testimonials ?? 0}
          />
          <InfoCard
            title="Active Terms And Policies"
            value={data?.data?.terms ?? 0}
          />
        </div>
      )}
    </div>
  )
}
