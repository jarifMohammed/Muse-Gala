// ================================================================
// payments-tab.tsx
// ================================================================
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import moment from 'moment'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Props {
  data: any
}

const PaymentsTab = ({ data }: Props) => {
  // console.log('payments data', data)

  // Calculate total revenue from bookings
  const totalRevenue =
    data.reduce((sum: number, booking: any) => {
      return sum + (booking.price || 0)
    }, 0) || 0

  const paidBookings =
    data.filter((booking: any) => booking.status === 'Paid') || []
  const pendingBookings =
    data.filter((booking: any) => booking.status === 'Pending') || []

  return (
    <div className="space-y-3 w-full font-sans ">
      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-4">
            <div className="text-base text-gray-500 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              From {data.length || 0} bookings
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-4">
            <div className="text-base text-gray-500 mb-1">Paid Bookings</div>
            <div className="text-2xl font-bold text-blue-600">
              {paidBookings.length}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ${paidBookings.reduce((sum: number, b: any) => sum + b.price, 0)}{' '}
              total
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-2">
            <div className="text-base text-gray-500 mb-1">Pending Payments</div>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingBookings.length}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              $
              {pendingBookings.reduce(
                (sum: number, b: any) => sum + b.price,
                0
              )}{' '}
              pending
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="font-light font-sans">
            Payment History
          </CardTitle>
        </CardHeader>

        <CardContent className="font-light text-[14px] font-sans">
          {data && data.length > 0 ? (
            <div className="max-h-[280px] overflow-auto border rounded-md space-y-3">
              {data.map((booking: any, index: number) => (
                <div
                  key={booking.bookingId || index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Image
                        src={booking.thumbnail}
                        alt={booking.dressName}
                        width={64}
                        height={64}
                        className="rounded object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-base">
                          {booking.dressName}
                        </h4>

                        <p className="text-base text-gray-500 mt-1">
                          Booking ID: {booking.bookingId}
                        </p>

                        <p className="text-base text-gray-500">
                          Booked:{' '}
                          {moment(booking.bookedAt).format(
                            'D MMM YYYY, hh:mm A'
                          )}
                        </p>

                        <p className="text-base text-gray-600 mt-1">
                          Rental: {moment(booking.start).format('D MMM')} -{' '}
                          {moment(booking.end).format('D MMM YYYY')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${booking.price}
                      </div>
                      <span
                        className={cn(
                          'inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium',
                          booking.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payment history available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentsTab
