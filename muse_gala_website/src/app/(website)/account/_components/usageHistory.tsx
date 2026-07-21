// ==================== FILE: app/account/promo-codes/_components/UsageHistory.tsx ====================
'use client'

import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { PromoUsage } from '@/lib/promoCodeApi'

interface UsageHistoryProps {
  usageData: PromoUsage[]
}

export function UsageHistory({ usageData }: UsageHistoryProps) {
  if (usageData.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No usage history yet</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promo Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Used At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usageData.map((usage, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono font-semibold text-sm">
                    {usage.promoCodeName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-600 font-medium">
                    ${usage.discountApplied}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(usage.usedAt), 'MMM dd, yyyy hh:mm a')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {usage.bookingId.slice(-8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
