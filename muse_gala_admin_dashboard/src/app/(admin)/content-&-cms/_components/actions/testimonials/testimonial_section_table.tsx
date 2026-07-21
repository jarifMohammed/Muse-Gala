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
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/custom/skeleton'
import { useSession } from 'next-auth/react'
import {
  TestimonialSectionAdd,
  TestimonialSectionEdit,
} from './add_testimonial'

// ---- Types ----
export type Testimonial = {
  _id: string
  customerName: string
  content: string
  rating: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// ---- Fetcher ----
async function fetchTestimonials(accessToken: string): Promise<Testimonial[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/testimonoal`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  if (!res.ok) throw new Error('Failed to fetch testimonials')
  const json = await res.json()
  return json.data
}

// ---- Columns ----
const columns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer Name',
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.customerName}>
        {row.original.customerName}
      </div>
    ),
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.content}>
        {row.original.content}
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-1">
        <span className="font-medium">{row.original.rating}</span>
        <span className="text-yellow-500">★</span>
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) =>
      new Date(row.original.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
          row.original.status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => (
      <TestimonialSectionEdit id={row.original._id}>
        <button className="px-3 py-1 text-[13px] rounded-lg bg-black text-white hover:bg-gray-800 transition-colors">
          View Details
        </button>
      </TestimonialSectionEdit>
    ),
  },
]

// ---- Main Component ----
export default function TestimonialTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

  // Get session for access token
  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  // ---- Fetch Data ----
  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => fetchTestimonials(accessToken),
  })

  // reset to first page when search/filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [search, statusFilter])

  // ---- Filtering ----
  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter((item) => {
      const matchesSearch = JSON.stringify(item)
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' ? true : item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

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
    <div className="bg-white shadow-md rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 py-5">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">Testimonials</h2>
          <div className="flex items-center gap-8">
            <Input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px]"
            />
            <div>
              <Select
                defaultValue="all"
                onValueChange={(val) =>
                  setStatusFilter(val as 'all' | 'active' | 'inactive')
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Add Testimonial Button */}
        <TestimonialSectionAdd />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full border rounded-2xl overflow-hidden">
          <table className="w-full rounded-xl text-sm">
            <thead>
              <tr>
                <th className="p-2 text-center text-gray-500">
                  Testimonial ID
                </th>
                <th className="p-2 text-center text-gray-500">Customer</th>
                <th className="p-2 text-center text-gray-500">Content</th>
                <th className="p-2 text-center text-gray-500">Rating</th>
                <th className="p-2 text-center text-gray-500">Last Updated</th>
                <th className="p-2 text-center text-gray-500">Status</th>
                <th className="p-2 text-center text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="p-2 text-center">
                      <Skeleton className="h-5 w-24 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <p className="text-red-500 mt-3 text-center">
          Failed to load testimonials
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
                      No data found
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
