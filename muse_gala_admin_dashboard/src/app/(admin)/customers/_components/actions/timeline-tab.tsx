// ================================================================
// timeline-tab.tsx
// ================================================================
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import moment from 'moment'
import { cn } from '@/lib/utils'

interface Props {
  data: any[]
}

const TimelineTab = ({ data }: Props) => {
  // console.log('timeline data', data)

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="font-light font-sans">
            Activity Timeline
          </CardTitle>
        </CardHeader>

        <CardContent className="font-light text-[14px] font-sans">
          <div className="max-h-[450px] overflow-y-auto pr-2">
            {/* <-- Scrollable wrapper added */}
            {data && data.length > 0 ? (
              <div className="space-y-4">
                {data.map((item: any, index: number) => (
                  <div key={item.bookingId || index} className="flex gap-4">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full',
                          item.disputeId ? 'bg-red-600' : 'bg-blue-600'
                        )}
                      ></div>
                      {index < data.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 pb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-base">
                          {item.disputeId
                            ? '🚨 Dispute Created'
                            : '📦 Booking Created'}
                        </p>

                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>Booking ID: {item.bookingId}</p>

                          {item.bookingStatus && (
                            <p>
                              Status:{' '}
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded text-xs font-medium',
                                  item.bookingStatus === 'Paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                )}
                              >
                                {item.bookingStatus}
                              </span>
                            </p>
                          )}

                          {item.disputeId && (
                            <p className="text-red-600">
                              Dispute ID: {item.disputeId}
                            </p>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          {moment(
                            item.bookingCreatedAt || item.disputeCreatedAt
                          ).format('D MMM YYYY, hh:mm A')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No timeline data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimelineTab
