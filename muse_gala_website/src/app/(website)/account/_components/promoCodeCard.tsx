// ==================== FILE: app/account/promo-codes/_components/PromoCodeCard.tsx ====================
'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { UserPromoCode } from '@/lib/promoCodeApi'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface PromoCodeCardProps {
  promo: UserPromoCode
}

export function PromoCodeCard({ promo }: PromoCodeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(promo.code)
    setCopied(true)
    toast.success('Promo code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const isExpired = new Date(promo.expiresAt) < new Date()
  const isMaxedOut = promo.usedCount >= promo.maxUsage

  return (
    <Card className="p-6 hover:shadow-lg rounded-sm transition-shadow w-full">
      <div className="space-y-4">
        {/* Code Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-medium font-mono tracking-widest break-all">
                {promo.code}
              </h3>

              <button
                onClick={handleCopy}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={
                  promo.isActive && !isExpired && !isMaxedOut
                    ? 'default'
                    : 'secondary'
                }
                className={
                  promo.isActive && !isExpired && !isMaxedOut
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700'
                }
              >
                {isExpired
                  ? 'Expired'
                  : isMaxedOut
                  ? 'Maxed Out'
                  : promo.isActive
                  ? 'Active'
                  : 'Inactive'}
              </Badge>
            </div>
          </div>

          {/* Discount Badge */}
          <div
            className="text-white px-4 py-3 rounded-lg text-center min-w-[100px] shadow-md"
            style={{
              background: `linear-gradient(135deg, ${'#891D33'}, ${'#891D33'}CC)`,
            }}
          >
            <div className="text-2xl font-bold">
              {promo.discountType === 'PERCENTAGE'
                ? `${promo.discount}%`
                : `$${promo.discount}`}
            </div>
            <div className="text-xs opacity-90">OFF</div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Usage
            </p>
            <p className="text-sm font-medium">
              {promo.usedCount} / {promo.maxUsage}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Expires
            </p>
            <p className="text-sm font-medium">
              {format(new Date(promo.expiresAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(promo.usedCount / promo.maxUsage) * 100}%`,
                backgroundColor: '#891D33',
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
