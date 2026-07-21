// ==================== FILE: _components/TopLendersTable.tsx ====================
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/custom/skeleton'
import { Eye } from 'lucide-react'
import { TopLender } from '@/lib/overview-api'
import { PaginationControls } from '@/components/ui/pagination-controls'

interface TopLendersTableProps {
  lenders: TopLender[]
  loading?: boolean
  pagination?: {
    currentPage: number
    totalPages: number
    totalData: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  onPageChange?: (page: number) => void
}

export function TopLendersTable({
  lenders,
  loading,
  pagination,
  onPageChange,
}: TopLendersTableProps) {
  if (loading) {
    return (
      <Card className="rounded-xl font-sans shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-wider">
            Top Lenders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-light tracking-wider">
          Top Lenders
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full font-light tracking-wider text-base">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-gray-600 font-normal">
                  Lender ID
                </th>
                <th className="text-left p-4 text-gray-600 font-normal">
                  Lender Name
                </th>
                <th className="text-center p-4 text-gray-600 font-normal">
                  Total Bookings
                </th>
                <th className="text-center p-4 text-gray-600 font-normal">
                  Revenue Generated
                </th>
                <th className="text-center p-4 text-gray-600 font-normal">
                  Rating
                </th>
                <th className="text-center p-4 text-gray-600 font-normal">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {lenders.length > 0 ? (
                lenders.map((lender, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 text-gray-700 font-sans"
                  >
                    <td className="p-4 text-base">
                      {/* #{String(idx + 1).padStart(4, '0')} */}
                      {lender?.id}
                    </td>

                    <td className="p-4 text-base">
                      {lender.name || lender.email}
                    </td>

                    <td className="p-4 text-center text-base">
                      {lender.totalBookings}
                    </td>

                    <td className="p-4 text-center text-base font-light">
                      ${lender.revenue.toLocaleString()}
                    </td>

                    <td className="p-4 text-center text-base">4.8</td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-gray-600 hover:text-black">
                          <Eye className="w-5 h-5" />
                        </button>
                        {/* <button className="text-gray-600 hover:text-black">
                          <TrendingUp className="w-5 h-5" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-5 text-center text-gray-500 text-base"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/*  Custom Pagination (Using your PaginationControls component) */}
        {pagination && (
          <div className="mt-6">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalData}
              itemsPerPage={10} // or dynamic if needed
              onPageChange={page => onPageChange && onPageChange(page)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
