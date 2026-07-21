// ==================== FILE: _components/PerformanceCharts.tsx ====================
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { Skeleton } from '@/components/ui/custom/skeleton'

interface PerformanceChartsProps {
  revenueData: Array<{ month: string; value: number }>
  disputeData: {
    pending: number
    escalated: number
    resolved: number
  }
  bookingData: {
    active: number
    completed: number
    cancelledOrPending: number
  }
  loading?: boolean
}

const COLORS = {
  pending: '#3B82F6',
  inProgress: '#FB923C',
  resolved: '#FBBF24',
}

const BOOKING_COLORS = {
  active: '#000000',
  completed: '#000000',
  cancelled: '#D1D5DB',
}

export function PerformanceCharts({
  revenueData,
  disputeData,
  bookingData,
  loading,
}: PerformanceChartsProps) {
  const maxRevenue = Math.max(...revenueData.map(d => d.value), 0)

  const chartDisputeData = [
    { name: 'Pending', value: disputeData.pending },
    { name: 'In Progress', value: disputeData.escalated },
    { name: 'Resolved', value: disputeData.resolved },
  ]

  const chartBookingData = [
    { name: 'Active', value: bookingData.active },
    { name: 'Completed', value: bookingData.completed },
    { name: 'Pending', value: bookingData.cancelledOrPending },
  ]

  if (loading) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl tracking-wider font-light">
            Performance Charts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl tracking-wider font-normal mb-6">
          Performance Charts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans text-lg">
          {/* Revenue Trend */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-normal tracking-wider text-gray-600">
                Revenue Trend
              </h3>
              {maxRevenue > 0 && (
                <span className="text-base font-normal tracking-wider text-gray-600">
                  ${maxRevenue.toLocaleString()}
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Dispute Resolution */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <h3 className="text-base font-normal tracking-wider text-gray-600">
                Dispute Resolution Rate
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartDisputeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartDisputeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(COLORS)[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS.pending }}
                />
                <span className="text-sm text-gray-600 tracking-widest">
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS.inProgress }}
                />
                <span className="text-sm text-gray-600 tracking-widest">
                  In Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS.resolved }}
                />
                <span className="text-sm text-gray-600 tracking-widest">
                  Resolved
                </span>
              </div>
            </div>
          </div>

          {/* Booking Volume */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-normal tracking-wider text-gray-600">
                Booking Volume
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartBookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartBookingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(BOOKING_COLORS)[index]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <span className="text-sm text-gray-600 tracking-widest">
                Active
              </span>
              <span className="text-sm text-gray-600 tracking-widest">
                Completed
              </span>
              <span className="text-sm text-gray-600 tracking-widest">
                Cancel
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
