'use client'

import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { format } from 'date-fns'
import { mainListing } from '../../types/mainListingsTypes'
import MainListingReviewModal from './mainListingReviewModal'
import { useState } from 'react'

function ListingActionsCell({ listing }: { listing: mainListing }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        className="px-3 py-1 text-sm rounded bg-black text-white"
        onClick={() => setOpen(true)}
      >
        <Eye className="h-4 w-4 mr-1" /> View
      </Button>

      <MainListingReviewModal
        open={open}
        onClose={() => setOpen(false)}
        dressId={listing._id}
      />
    </>
  )
}

export const mainListingColumn: ColumnDef<mainListing>[] = [
  {
    accessorKey: 'masterDressId',
    header: 'Listing ID',
    cell: ({ row }) => (
      <span className="font-medium text-gray-700">
        {row.original.masterDressId || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'thumbnail',
    header: 'Thumbnails',
    cell: ({ row }) => {
      const thumbnail = row.original.thumbnail
      return (
        <div className="flex items-center justify-center">
          <div className="relative w-14 h-20 overflow-hidden rounded-md">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt="Dress thumbnail"
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'dressName',
    header: 'Dress Name',
    cell: ({ row }) => (
      <span className="font-semibold text-gray-800 capitalize">
        {row.original.dressName}
      </span>
    ),
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ row }) => (
      <span className="text-gray-700 capitalize">
        {row.original.brand || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'sizes',
    header: 'Size',
    cell: ({ row }) => {
      const sizes = row.original.sizes
      const displayValue = Array.isArray(sizes)
        ? (sizes as string[])
          .map(
            (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
          )
          .join(', ')
        : typeof sizes === 'string'
          ? (sizes as string).charAt(0).toUpperCase() + (sizes as string).slice(1).toLowerCase()
          : '—'

      return <span className="text-gray-700">{displayValue}</span>
    },
  },
  {
    accessorKey: 'lenderIds',
    header: 'Lenders',
    cell: ({ row }) => (
      <span className="text-gray-700 font-medium">
        {row.original.lenderIds?.length || 0}
      </span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <Badge
          className={`${isActive
            ? 'bg-green-100 text-green-700 border-green-200'
            : 'bg-red-100 text-red-700 border-red-200'
            }`}
        >
          {isActive ? 'Active' : 'Paused'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => {
      const date = row.original.updatedAt
      return (
        <span className="text-gray-600 text-sm">
          {date ? format(new Date(date), 'MMM dd, yyyy') : '—'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Action',
    // cell: ({ row }) => (
    //   <Button
    //     variant="default"
    //     className="bg-black text-white hover:bg-gray-800"
    //     onClick={() => console.log('View clicked for', row.original._id)}
    //   >
    //     <Eye className="h-4 w-4 mr-1" /> View
    //   </Button>
    // ),
    cell: ({ row }) => <ListingActionsCell listing={row.original} />,
  },
]
