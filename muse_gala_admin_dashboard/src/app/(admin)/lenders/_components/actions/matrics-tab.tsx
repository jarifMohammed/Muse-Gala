/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  data?: {
    lender: any
    bookings: { count: number; data: any[] }
    listings: { approvedCount: number; data: any[] }
    disputes: { count: number; data: any[] }
    payouts: { totalPaidAmount: number }
  }
  isLoading: boolean
}

const MetricsTab = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <Card className="shadow-none rounded-[6px] w-full">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBookings = data?.bookings?.count || 0
  const totalListings = data?.listings?.data?.length || 0
  const approvedListings = data?.listings?.approvedCount || 0
  const totalDisputes = data?.disputes?.count || 0
  const totalRevenue = data?.payouts?.totalPaidAmount || 0

  // Calculate resolved and pending disputes
  const resolvedDisputes =
    data?.disputes?.data?.filter(d => d.status === 'Resolved').length || 0
  const pendingDisputes = totalDisputes - resolvedDisputes

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="font-light font-sans">
            Performance Metrics
          </CardTitle>
        </CardHeader>

        <CardContent className="font-light text-[14px] font-sans">
          <div className="space-y-2">
            <p>
              <span className="font-medium">Total Bookings:</span>{' '}
              {totalBookings}
            </p>
            <p>
              <span className="font-medium">Total Listings:</span>{' '}
              {totalListings}
            </p>
            <p>
              <span className="font-medium">Approved Listings:</span>{' '}
              {approvedListings}
            </p>
            <p>
              <span className="font-medium">Revenue Generated:</span> $
              {totalRevenue.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Total Disputes:</span>{' '}
              {totalDisputes} ({resolvedDisputes} Resolved, {pendingDisputes}{' '}
              Pending)
            </p>
            <p>
              <span className="font-medium">Average Rating:</span>{' '}
              {data?.lender?.totalRatting || 0}/5
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MetricsTab
