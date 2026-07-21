'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import {
  useGetDashboardStats,
  useGetRevenueTrends,
  useGetTopLenders,
  useGetTopDresses,
} from '@/lib/overview-api'
import { DateFilter } from './date-filter'
import { StatCard } from './state-card'
import { PerformanceCharts } from './performance-chart'
import { TopLendersTable } from './top-lender-table'
import { TopDressesTable } from './top-dress-table'

export default function OverviewDashboard() {
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  const currentDate = new Date()
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
  })
  const [lenderPage, setLenderPage] = useState(1)
  const [dressPage, setDressPage] = useState(1)

  // Fetch all data
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStats(
    accessToken,
    dateRange.startDate,
    dateRange.endDate,
  )

  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueTrends(
    accessToken,
    dateRange.startDate,
    dateRange.endDate,
  )

  const { data: lendersData, isLoading: lendersLoading } = useGetTopLenders(
    accessToken,
    lenderPage,
    10,
  )

  const { data: dressesData, isLoading: dressesLoading } = useGetTopDresses(
    accessToken,
    dressPage,
    10,
  )

  // Extract data
  const stats = statsData?.data
  const revenue = revenueData?.data?.revenueTrends || []
  const lenders = lendersData?.data?.lenders || []
  const lendersPagination = lendersData?.data?.pagination
  const dresses = dressesData?.data?.results || []
  const dressesPagination = dressesData?.data?.paginationInfo

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate })
  }

  return (
    <div className="space-y-6 p-6 bg-transparent min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl uppercase tracking-[0.3em] font-light tracking-wider">OVERVIEW</h1>
        <DateFilter onDateChange={handleDateChange} />
      </div>

      {/* Stats Grid */}
      {statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <StatCard key={i} title="" value="" loading />
          ))}
        </div>
      )}

      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
          />
          <StatCard title="Active Bookings" value={stats.activeBookings} />
          <StatCard title="Active Lenders" value={stats.activeLenders} />
          <StatCard title="Pending Disputes" value={stats.pendingDisputes} />
        </div>
      )}

      {/* Performance Charts */}
      <PerformanceCharts
        revenueData={revenue}
        disputeData={
          stats?.disputeResolution || {
            pending: 0,
            escalated: 0,
            resolved: 0,
          }
        }
        bookingData={
          stats?.bookingVolume || {
            active: 0,
            completed: 0,
            cancelledOrPending: 0,
          }
        }
        loading={revenueLoading || statsLoading}
      />

      {/* Top Lenders Table */}
      <TopLendersTable
        lenders={lenders}
        loading={lendersLoading}
        pagination={lendersPagination}
        onPageChange={setLenderPage}
      />

      {/* Top Dresses Table */}
      <TopDressesTable
        dresses={dresses}
        loading={dressesLoading}
        pagination={dressesPagination}
        onPageChange={setDressPage}
      />
    </div>
  )
}
