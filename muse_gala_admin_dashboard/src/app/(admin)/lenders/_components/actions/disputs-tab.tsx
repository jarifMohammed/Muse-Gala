import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, Pencil } from 'lucide-react'
import { useState } from 'react'

interface Props {
  data?: {
    count: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
  }
  isLoading: boolean
}

const DisputesTab = ({ data, isLoading }: Props) => {
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

  const disputes = data?.data || []
  const filteredDisputes =
    statusFilter === 'All'
      ? disputes
      : disputes.filter(d => d.status === statusFilter)

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Disputes</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="text-sm font-light">
            Total Disputes: {filteredDisputes.length}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {filteredDisputes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No disputes found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-3 px-2 font-medium">Dispute ID</th>
                    <th className="py-3 px-2 font-medium">Booking ID</th>
                    <th className="py-3 px-2 font-medium">Reason</th>
                    <th className="py-3 px-2 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisputes.map(dispute => (
                    <tr key={dispute._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">{dispute._id.slice(-6)}</td>
                      <td className="py-3 px-2">
                        {dispute.booking?.slice(-6) || 'N/A'}
                      </td>
                      <td className="py-3 px-2">
                        {dispute.issueType || 'Not Returned'}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            dispute.status === 'Resolved'
                              ? 'bg-green-100 text-green-800'
                              : dispute.status === 'Pending'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {dispute.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
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

export default DisputesTab
