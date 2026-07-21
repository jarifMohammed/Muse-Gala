'use client'

import { StatCard } from '../../_components/dashboard-overview/state-card'
import { useGetLenderStats } from '@/lib/overview-api'
import { useSession } from 'next-auth/react'

const LenderHeader = () => {
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  const { data: statsData, isLoading } = useGetLenderStats(accessToken)
  const stats = statsData?.data

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl uppercase font-light tracking-[0.2em]">MANAGE LENDERS</h1>
      </div>

      <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">

        <StatCard title="Active Lenders" value={stats?.activeLenders || '0'} loading={isLoading} />
        <StatCard title="Pending Applications" value={stats?.totalPendingApplications || '0'} loading={isLoading} />
        <StatCard title="Approved Lenders" value={stats?.totalApprovedLenders || '0'} loading={isLoading} />
      </div>
    </div>
  )
}

export default LenderHeader
