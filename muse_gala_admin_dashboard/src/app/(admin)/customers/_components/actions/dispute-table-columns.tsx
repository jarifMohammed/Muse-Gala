// ================================================================
// dispute-table-columns.tsx
// ================================================================
'use client'

import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { cn } from '@/lib/utils'

export interface DisputeData {
  disputeId: string
  bookingId: string
  issueType: string
  status: string
  createdAt: string
}

export const disputeTableColumns: ColumnDef<DisputeData>[] = [
  {
    accessorKey: 'disputeId',
    header: 'Dispute ID',
  },
  {
    accessorKey: 'bookingId',
    header: 'Booking ID',
  },
  {
    accessorKey: 'issueType',
    header: 'Issue Type',
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.issueType}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <div
          className={cn(
            'w-fit px-3 py-1 rounded-full text-xs font-medium',
            status === 'Resolved'
              ? 'bg-green-100 text-green-800'
              : status === 'Escalated'
              ? 'bg-red-100 text-red-800'
              : status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return (
        <div>
          {moment(row.original.createdAt).format('D MMM YYYY, hh:mm A')}
        </div>
      )
    },
  },
]
