// ==================== FILE: _components/TopDressesTable.tsx ====================
'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/custom/skeleton'
import { Eye } from 'lucide-react'
import { TopDress } from '@/lib/overview-api'
import { PaginationControls } from '@/components/ui/pagination-controls'

interface TopDressesTableProps {
  dresses: TopDress[]
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

export function TopDressesTable({
  dresses,
  loading,
  pagination,
  onPageChange,
}: TopDressesTableProps) {
  if (loading) {
    return (
      <Card className="rounded-2xl shadow-sm font-sans">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-wider">
            Top Dresses
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
          Top Dresses
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full font-light tracking-wider text-base">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-gray-600 font-normal">
                  Dress ID
                </th>
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
              {dresses.length > 0 ? (
                dresses.map(dress => (
                  <tr
                    key={dress.masterDressDbId}
                    className="border-b hover:bg-gray-50 text-gray-700 font-sans"
                  >
                    <td className="p-4">{dress.masterDressDbId}</td>

                    <td className="p-4">{dress.lenderId}</td>

                    <td className="p-4">
                      {dress.lenderName || dress.lenderEmail}
                    </td>

                    <td className="p-4 text-center">{dress.totalBookings}</td>

                    <td className="p-4 text-center">
                      ${dress.revenue.toLocaleString()}
                    </td>

                    <td className="p-4 text-center">4.8</td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-gray-600 hover:text-black">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-5 text-center text-gray-500 text-base"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination Controls */}
        {pagination && (
          <div className="mt-6">
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalData}
              itemsPerPage={10}
              onPageChange={page => onPageChange && onPageChange(page)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
