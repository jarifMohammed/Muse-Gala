// ================================================================
// booking-table-columns.tsx
// ================================================================
'use client'

import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface BookingData {
  bookingId: string
  dressName: string
  thumbnail: string
  lenderId: string
  status: string
  price: number
  start: string
  end: string
  bookedAt: string
}

export const bookingTableColumns: ColumnDef<BookingData>[] = [
  {
    accessorKey: 'thumbnail',
    header: 'Dress',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-3">
          <Image
            src={row.original.thumbnail}
            alt={row.original.dressName}
            width={50}
            height={50}
            className="rounded object-cover"
          />
          <div>
            <p className="font-medium">{row.original.dressName}</p>
            <p className="text-xs text-gray-500">{row.original.bookingId}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'lenderId',
    header: 'LenderID',
    cell: ({ row }) => {
      return <div className="font-medium">${row.original.lenderId}</div>
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
            status === 'Paid'
              ? 'bg-green-100 text-green-800'
              : status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'Cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800',
          )}
        >
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      return <div className="font-medium">${row.original.price}</div>
    },
  },
  {
    accessorKey: 'start',
    header: 'Rental Period',
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          <div>{moment(row.original.start).format('D MMM YYYY')}</div>
          <div className="text-gray-500">to</div>
          <div>{moment(row.original.end).format('D MMM YYYY')}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'bookedAt',
    header: 'Booked At',
    cell: ({ row }) => {
      return (
        <div>{moment(row.original.bookedAt).format('D MMM YYYY, hh:mm A')}</div>
      )
    },
  },
]
