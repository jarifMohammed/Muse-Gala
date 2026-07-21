import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

interface Props {
  data?: {
    approvedCount: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
  }
  isLoading: boolean
}

const ListingTab = ({ data, isLoading }: Props) => {
  const [statusFilter, setStatusFilter] = useState('All')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Card className="shadow-none rounded-[6px]">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const listings = data?.data || []
  const filteredListings =
    statusFilter === 'All'
      ? listings
      : listings.filter(l => l.status === statusFilter.toLowerCase())

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Listings</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-light">
            Total Listings: {filteredListings.length}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {filteredListings.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No listings found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-3 px-2 font-medium">Dress Name</th>
                    <th className="py-3 px-2 font-medium">Listing ID</th>
                    <th className="py-3 px-2 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map(listing => (
                    <tr key={listing._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">{listing.dressName}</td>
                      <td className="py-3 px-2">{listing.dressId}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            listing.status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {listing.status === 'available'
                            ? 'Active'
                            : 'In Active'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        ${listing.rentalPrice?.fourDays || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ListingTab
