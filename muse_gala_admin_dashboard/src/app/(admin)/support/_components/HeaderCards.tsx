'use client'

import { useQuery } from '@tanstack/react-query'
import { InfoCard } from '@/components/cards/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/custom/skeleton'
import { useSession } from 'next-auth/react'

interface StatsResponse {
  status: boolean
  message: string
  data: {
    total: number
    issueTypeStats: {
      payment?: number
      booking?: number
      unknown?: number | undefined
    }
    open: number
    resolved: number
  }
}

// ---- Fetcher ----
async function fetchStats(accessToken: string): Promise<StatsResponse['data']> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/support/stats`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  if (!res.ok) throw new Error('Failed to fetch stats')
  const json: StatsResponse = await res.json()
  return json.data
}

export default function HeaderCards() {
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery<StatsResponse['data'], Error>({
    queryKey: ['support-stats', accessToken],
    queryFn: () => fetchStats(accessToken),
    enabled: !!accessToken,
  })

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-start">
        <h1 className="text-2xl uppercase md:text-[32px] font-light tracking-[0.2em]">
          SUPPORT
        </h1>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-lg">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 space-y-3 rounded-xl border shadow-md">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-500 mt-3 text-center">
          {(error as Error).message}
        </p>
      )}

      {stats && (
        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-lg">
          {/* Open tickets */}
          <InfoCard title="Open Tickets" value={stats.open.toString()} />

          {/* Top Issue Types */}
          <Card className="hover:bg-black hover:text-white hover:scale-105 transition-all duration-500 ease-in-out">
            <CardHeader>
              <CardTitle className="font-normal leading-[120%]">
                Top Issue Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-gray-600 hover:text-white">
                {Object.entries(stats.issueTypeStats).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="font-medium">
                      {key === 'unknown' ? 'Guest' : key}
                    </span>
                    <span className="font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Resolved */}
          <InfoCard title="Resolved" value={stats.resolved.toString()} />
        </div>
      )}
    </div>
  )
}
