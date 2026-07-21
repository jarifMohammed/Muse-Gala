// ==================== FILE: _components/StatCard.tsx ====================
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/custom/skeleton'

interface StatCardProps {
  title: string
  value: string | number
  loading?: boolean
}

export function StatCard({ title, value, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border  p-6 shadow-sm space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    )
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-8">
        <p className="text-normal tracking-wider text-gray-600 mb-2">{title}</p>
        <p className="text-3xl text-normal font-sans tracking-wider">{value}</p>
      </CardContent>
    </Card>
  )
}
