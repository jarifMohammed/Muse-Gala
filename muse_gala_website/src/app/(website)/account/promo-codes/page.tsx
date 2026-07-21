'use client'

import { useGetUserPromoCodes } from '@/lib/promoCodeApi'
import { useSession } from 'next-auth/react'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { PromoCodeCard } from '../_components/promoCodeCard'
import { UsageHistory } from '../_components/usageHistory'

export default function UserPromoCodesPage() {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const { data, isLoading, isError } = useGetUserPromoCodes(accessToken)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-red-500">Failed to load promo codes</p>
        </Card>
      </div>
    )
  }

  const promoCodes = data?.data || []
  const usageData = data?.usageData || []
  const totalSavings = data?.totalDiscountGiven || 0

  return (
    <div className="container mx-auto px-8 py-5">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2 px-6">
          <h1 className="text-3xl font-light tracking-wider uppercase">MY PROMO CODES</h1>
          <p className="text-gray-600 font-light text-sm tracking-wider">
            View and manage your available promotional codes
          </p>
        </div>

        {/* Total Savings Card */}
        {totalSavings > 0 && (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Savings</p>
                <p className="text-3xl font-bold text-green-600">
                  ${totalSavings.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Times Used</p>
                <p className="text-2xl font-bold text-gray-800">
                  {usageData.length}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Promo Codes Grid */}
        {promoCodes.length > 0 ? (
          <>
            <div className="px-6">
              {/* <h2 className="text-xl font-light tracking-widest mb-4">
                Available Codes
              </h2> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoCodes.map(promo => (
                  <PromoCodeCard key={promo._id} promo={promo} />
                ))}
              </div>
            </div>

            {/* Usage History */}
            {usageData.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Usage History</h2>
                <UsageHistory usageData={usageData} />
              </div>
            )}
          </>
        ) : (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">🎟️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 uppercase tracking-wider">
                  NO OFFERS YET
                </h3>
                <p className="text-gray-600 font-light tracking-wide">
                  Your offers will appear here when available.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
