'use client'

import React, { useMemo, useState, useEffect } from 'react'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaginationControls } from '@/components/ui/pagination-controls'

import { Skeleton } from '@/components/ui/custom/skeleton'
import { useSession } from 'next-auth/react'
import { SupportDetailsPopup } from './supportDetailsModal'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'

// ---- Types ----
export type Ticket = {
  _id: string
  user?: { _id: string; email: string; name?: string } | null
  lender?: { _id: string; email: string; name?: string } | null
  name?: string
  email?: string
  issueType?: string
  createdAt: string
  status: 'pending' | 'resolved' | 'in-progress'
  priority: 'low' | 'medium' | 'high'
  message?: string
}

// ---- Fetcher ----
async function fetchTickets(accessToken: string): Promise<Ticket[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/support/get`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  if (!res.ok) throw new Error('Failed to fetch tickets')
  const json = await res.json()
  return json.data?.contacts || []
}

// ---- Columns ----
const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      if (row.original.user) {
        return row.original.user.name || <span className="text-gray-400">N/A</span>;
      } else if (row.original.lender) {
        return row.original.lender.name || <span className="text-gray-400">N/A</span>;
      } else {
        // Guest
        return row.original.name || <span className="text-gray-400">N/A</span>;
      }
    },
  },
  {
    accessorKey: '_id',
    header: 'Ticket ID',
    cell: ({ row }) => row.original._id,
  },
  {
    accessorKey: 'user',
    header: 'User ID',
    cell: ({ row }) =>
      row.original.user?._id ||
      row.original.lender?._id || (
        <span className="text-gray-400">Guest</span>
      ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      if (row.original.user) {
        return row.original.user.email || <span className="text-gray-400">N/A</span>;
      } else if (row.original.lender) {
        return row.original.lender.email || <span className="text-gray-400">N/A</span>;
      } else {
        // Guest
        return row.original.email || <span className="text-gray-400">N/A</span>;
      }
    },
  },
  {
    accessorKey: 'issueType',
    header: 'Issue Type',
    cell: ({ row }) => row.original.issueType || 'General',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      let statusClass = 'bg-blue-100 text-blue-700';
      if (row.original.status === 'pending') statusClass = 'bg-yellow-100 text-yellow-700';
      else if (row.original.status === 'resolved') statusClass = 'bg-green-100 text-green-700';
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClass}`}>
          {row.original.status}
        </span>
      );
    },
  },
  // priority column removed
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const id = row.original?._id
      return (
        <SupportDetailsPopup id={id} data={row.original}>
          <Button
            variant="default"
            className="px-3 py-1 text-[13px] rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
          >
            View Details
          </Button>
        </SupportDetailsPopup>
      )
    },
  },
]

// ---- Main Component ----

interface SupportTableProps {
  initialData?: Ticket[]
}

export default function SupportTable({ initialData }: SupportTableProps = {}) {
  const [search, setSearch] = useState('')
  const [issueFilter, setIssueFilter] = useState<string>('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

  // Get session for access token
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  // ---- Fetch Data ----
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tickets', accessToken],
    queryFn: () => fetchTickets(accessToken),
    enabled: !!accessToken && !initialData,
  })

  // reset to first page when search/filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [search, issueFilter])

  // ---- Filtering ----
  const filteredData = useMemo(() => {
    const baseData = initialData || data || []
    return baseData.filter((item) => {
      const matchesSearch = JSON.stringify(item)
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesIssue =
        issueFilter === 'all' ? true : item.issueType === issueFilter
      return matchesSearch && matchesIssue
    })
  }, [initialData, data, search, issueFilter])

  // ---- Table ----
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: Math.max(
      1,
      Math.ceil(filteredData.length / pagination.pageSize)
    ),
  })

  return (
    <div className="bg-white shadow-md rounded-xl p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 py-5 px-2">
        <div className="flex w-full items-center justify-between gap-5">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search via id, type, status or priority..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />

          {/* Filter */}
          <Select
            defaultValue="all"
            onValueChange={(val) => setIssueFilter(val)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by issue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="booking">Booking</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full border rounded-2xl overflow-hidden">
          <table className="w-full rounded-xl text-sm">
            <thead>
              <tr>
                <th className="p-2 text-center text-gray-500">Ticket ID</th>
                <th className="p-2 text-center text-gray-500">User ID</th>
                <th className="p-2 text-center text-gray-500">Issue Type</th>
                <th className="p-2 text-center text-gray-500">Date</th>
                <th className="p-2 text-center text-gray-500">Status</th>
                <th className="p-2 text-center text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map(() => {
                const rowKey = `skeleton-row-${Math.random().toString(36).substr(2, 9)}`;
                return (
                  <tr key={rowKey} className="border-t">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={`skeleton-cell-${rowKey}-${j}`} className="p-2 text-center">
                        <Skeleton className="h-5 w-24 mx-auto" />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <p className="text-red-500 mt-3 text-center">
          Failed to load support tickets
        </p>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="w-full border rounded-2xl overflow-hidden">
            <table className="w-full rounded-xl text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-center p-2 text-gray-500 font-medium"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 text-gray-900 text-base"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-2 text-center">
                          <div className="flex justify-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
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
                      className="p-4 text-center text-gray-500"
                    >
                      No tickets found
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
              onPageChange={(page) => {
                table.setPageIndex(page - 1)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
