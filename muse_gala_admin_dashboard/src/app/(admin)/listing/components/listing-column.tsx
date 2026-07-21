'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'
import ListingReviewModal from './lender-listing-container/listingReviewModal'
import { Listing } from '../types/listingsTypes'

function ListingActionsCell({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        className="px-3 py-1 text-sm rounded bg-black text-white"
        onClick={() => setOpen(true)}
      >
        View
      </Button>

      <ListingReviewModal
        open={open}
        onClose={() => setOpen(false)}
        listingId={listing._id}
      />
    </>
  )
}

export const listingColumn: ColumnDef<Listing>[] = [
  {
    accessorKey: 'dressId',
    header: 'Listing ID',
    cell: ({ row }) => row.original.dressId.slice(0, 20),
  },
  {
    accessorKey: 'media',
    header: 'Thumbnails',
    cell: ({ row }) => (
      <div className="w-full flex justify-center">
        <div className="w-12 h-16 relative rounded overflow-hidden flex">
          {row.original.media?.[0] && (
            <Image
              src={row.original.media[0]}
              alt={row.original.dressName}
              fill
              sizes="48px"
              className="object-cover"
              priority={row.index === 0}
            />
          )}
        </div>
      </div>
    ),
  },
  { accessorKey: 'dressName', header: 'Dress Name' },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ row }) => (
      <span className="capitalize">{row.original.brand || '—'}</span>
    ),
  },
  { accessorKey: 'size', header: 'Size' },
  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.approvalStatus ?? 'approved'
      const statusColor =
        status === 'approved'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-700'

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor}`}
        >
          {status}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => <ListingActionsCell listing={row.original} />,
  },
]
