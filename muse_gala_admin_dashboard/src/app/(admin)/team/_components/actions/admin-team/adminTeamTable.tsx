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
import { AdminTeamSection } from './addAdmin'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'

// Type
type Admin = {
  _id: string
  name: string
  email: string
  permissions: string[]
  status: 'Active' | 'Suspended'
  createdAt: string
  updatedAt: string
  createdBy: {
    _id: string
    email: string
  }
}

// API function to fetch admins
const fetchAdmins = async (accessToken: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/team`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )
  if (!response.ok) {
    throw new Error('Failed to fetch admins')
  }
  const data = await response.json()
  return data.data
}

// Columns
const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.permissions.slice(0, 2).join(', ')}
        {row.original.permissions.length > 2 &&
          ` +${row.original.permissions.length - 2}`}
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
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
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.status === 'Active'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
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
      <AdminTeamSection mode="edit" adminId={row.original._id} />
    ),
  },
]

// Main Component
export default function AdminTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const cu = useSession()
  const accessToken = cu?.data?.user?.accessToken || ''

  // Fetch admins using React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: () => fetchAdmins(accessToken),
  })

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || 'Failed to fetch admins')
    }
  }, [isError, error])

  // reset to first page when search or filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [search, statusFilter])

  // filter locally
  const filteredData = useMemo(() => {
    if (!data?.admins) return []

    return data.admins.filter((item: Admin) => {
      const matchesSearch = JSON.stringify(item)
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || item.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

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

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 py-5">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">Admin Team</h2>
          <div className="flex items-center gap-8">
            <Input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px]"
            />
            <div>
              {/* Status Dropdown */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Add Admin Button */}
        <AdminTeamSection mode="add" onSuccess={refetch} />
      </div>

      {/* Table */}
      <div className="w-full border rounded overflow-hidden">
        <table className="w-full rounded text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-center p-2 text-gray-500 text-base font-medium py-5 border-b border-gray-300"
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
                  className="hover:bg-gray-50 text-gray-600 text-base font-sans"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 text-center py-6">
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
    </div>
  )
}
