/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useMemo, useState } from 'react'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChatsDetailsPopup } from './chatsDetailsModal'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import SkeletonLoader from '@/components/loader/SkeletonLoader'

// ✅ Type Definition
export type Conversation = {
  _id: string
  bookingId: any
  customerId: string
  lenderId: string
  customerName: string
  lenderName: string
  date: string
  lastMessage?: string
  status?: string
  flagged?: boolean
}

// ✅ Fetch Function
const fetchChatRooms = async (accessToken: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/message/chatrooms/admin/all`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch chat rooms')
  }

  const data = await res.json()
  return data?.data?.data || []
}

// ✅ Main Component
export default function MessageTable() {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'active' | 'flagged' | 'closed' | 'all'
  >('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

  // ✅ React Query — Fetch API Data
  const {
    data: chatRooms = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['chatRooms', accessToken],
    queryFn: () => fetchChatRooms(accessToken),
    enabled: !!accessToken,
  })

  // console.log('data', chatRooms)

  // Transform API Data
  const conversations: Conversation[] = useMemo(() => {
    if (!chatRooms?.length) return []

    return chatRooms.map((room: any) => {
      const customer =
        room.participants.find((p: any) => p.role === 'USER') || {}
      const lender =
        room.participants.find((p: any) => p.role === 'LENDER') || {}

      return {
        _id: room._id,
        customerName:
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
          customer.email ||
          'N/A',
        lenderName:
          `${lender.firstName || ''} ${lender.lastName || ''}`.trim() ||
          lender.email ||
          'N/A',
        customerId: customer._id || null,
        lenderId: lender._id || null,
        lastMessage: room.lastMessage || 'N/A',
        date: room.lastMessageAt || room.updatedAt || room.createdAt,
        bookingId: room.bookingId?._id || 'N/A',
        status: room.status, // or derive dynamically if needed
        flagged: room.flagged?.status === true || false,
      }
    })
  }, [chatRooms])

  // console.log('conversations', conversations)

  const filteredData = useMemo(() => {
    return conversations.filter(item => {
      const matchesSearch = JSON.stringify(item)
        .toLowerCase()
        .includes(search.toLowerCase())

      // ✅ Updated logic — when statusFilter === "all", skip filtering
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
            ? item.status?.toLowerCase() === 'active'
            : statusFilter === 'flagged'
              ? item.flagged === true
              : item.status?.toLowerCase() === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, conversations])

  // ✅ Table Columns
  const columns: ColumnDef<Conversation>[] = [
    { accessorKey: 'customerName', header: 'Customer Name' },
    { accessorKey: 'lenderName', header: 'Lender Name' },
    {
      accessorKey: 'lastMessage',
      header: 'Last Message',
      cell: ({ row }) => (
        <span className="line-clamp-1 text-gray-800">
          {row.original.lastMessage || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status || 'N/A'
        const lowerStatus = status.toLowerCase()
        const color =
          lowerStatus === 'active'
            ? 'bg-green-100 text-green-700'
            : lowerStatus === 'flagged'
              ? 'bg-yellow-100 text-yellow-700'
              : lowerStatus === 'closed'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-slate-100 text-slate-600'

        return (
          <Badge
            className={`${color} font-medium text-xs px-3 py-1 rounded-full`}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <ChatsDetailsPopup conversation={row.original}>
          <Button
            variant="default"
            className="px-3 py-1 text-[13px] rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
          >
            View Chat
          </Button>
        </ChatsDetailsPopup>
      ),
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.max(
      1,
      Math.ceil(filteredData.length / pagination.pageSize),
    ),
  })

  // ✅ Loading & Error States
  if (isLoading) return <SkeletonLoader />

  if (isError)
    return (
      <div className="flex items-center justify-center py-10 text-red-500">
        Failed to load chat rooms.
      </div>
    )

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <Input
          type="text"
          placeholder="Search by name, ID, or message..."
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-[250px]"
        />

        <Select
          value={statusFilter}
          onValueChange={value =>
            setStatusFilter(value as 'active' | 'flagged' | 'closed' | 'all')
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="w-full border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className="text-center p-3 text-gray-800 font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 text-gray-900 text-[15px]"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3 text-center">
                      <div className="flex justify-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-gray-500"
                >
                  No conversations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <PaginationControls
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          totalItems={filteredData.length}
          itemsPerPage={table.getState().pagination.pageSize}
          onPageChange={page => {
            table.setPageIndex(page - 1)
          }}
        />
      </div>
    </div>
  )
}
