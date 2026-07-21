/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { AddPromoCode } from './addPromoCode'
import { EditPromoCode } from './editPromoCode'
import { SendPromoModal } from './sendPromoCodeModal'
import { useGetPromoCodes, useDeletePromo, PromoCode } from '@/lib/promo'
import { toast } from 'sonner'
import { Trash2, Send, Edit } from 'lucide-react'

// Alert Dialog (shadcn)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function PromoCodeTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sendingPromo, setSendingPromo] = useState<{
    id: string
    code: string
  } | null>(null)

  // ===========================
  // 🔥 Delete Modal State
  // ===========================
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const session = useSession()
  const accessToken = session.data?.user?.accessToken || ''

  const { data, isLoading, isError } = useGetPromoCodes(accessToken)
  const deletePromo = useDeletePromo(accessToken)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promoCodes = data?.data || []

  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }, [search, statusFilter])

  const filteredData = useMemo(() => {
    if (!promoCodes) return []
    return promoCodes.filter((item: PromoCode) => {
      const matchesSearch = JSON.stringify(item)
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? item.isActive
          : !item.isActive
      return matchesSearch && matchesStatus
    })
  }, [promoCodes, search, statusFilter])

  // ===========================
  // 🔥 Delete Handler Opens Modal
  // ===========================
  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const columns: ColumnDef<PromoCode>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <div className="font-mono tracking-wider">{row.original.code}</div>
      ),
    },
    {
      accessorKey: 'discountType',
      header: 'Type',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.discountType.toLowerCase()}
        </div>
      ),
    },
    {
      accessorKey: 'discount',
      header: 'Discount',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.discountType === 'PERCENTAGE'
            ? `${row.original.discount}%`
            : `$${row.original.discount}`}
        </div>
      ),
    },
    {
      accessorKey: 'usedCount',
      header: 'Usage Count',
      cell: ({ row }) => (
        <div>
          {row.original.usedCount} / {row.original.maxUsage}
        </div>
      ),
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expiry Date',
      cell: ({ row }) =>
        new Date(row.original.expiresAt).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setEditingId(row.original._id)}
            title="edit promo"
            className=" text-white transition-colors"
          >
            <Edit className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={() =>
              setSendingPromo({ id: row.original._id, code: row.original.code })
            }
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Send to users"
          >
            <Send className="w-5 h-5 text-black" />
          </button>

          <button
            onClick={() => handleDelete(row.original._id)}
            className="p-1 text-gray-800 hover:text-red-800 transition-colors"
            title="Delete"
            disabled={deletePromo.isPending}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
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

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 py-5">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">
              Referral & Loyalty Programs
            </h2>
            <div className="flex items-center gap-8">
              <Input
                type="text"
                placeholder="Search..."
                onChange={e => setSearch(e.target.value)}
                className="w-[200px]"
              />
              <Select
                defaultValue="all"
                onValueChange={val =>
                  setStatusFilter(val as 'all' | 'active' | 'inactive')
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AddPromoCode />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="w-full border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  {[
                    'Code ID',
                    'Code',
                    'Discount',
                    'Usage Count',
                    'Expiry',
                    'Status',
                    'Action',
                  ].map(head => (
                    <th
                      key={head}
                      className="p-2 py-5 text-center text-gray-500"
                    >
                      {head}
                    </th>
                  ))}
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

        {/* Error */}
        {isError && (
          <p className="text-red-500 mt-3 text-center">
            Failed to load promo codes
          </p>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            <div className="w-full border rounded-2xl overflow-hidden">
              <table className="w-full rounded-xl text-base font-sans">
                <thead>
                  {table.getHeaderGroups().map(hg => (
                    <tr key={hg.id}>
                      {hg.headers.map(header => (
                        <th
                          key={header.id}
                          className="text-center p-2 py-3 text-gray-500 font-medium"
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
                        className="hover:bg-gray-50 py-3 text-gray-700 text-base border-t"
                      >
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="p-2 py-4 text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
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
                onPageChange={page => table.setPageIndex(page - 1)}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <EditPromoCode
          id={editingId}
          open={!!editingId}
          onOpenChange={open => !open && setEditingId(null)}
        />
      )}

      {/* Send Modal */}
      {sendingPromo && (
        <SendPromoModal
          promoId={sendingPromo.id}
          promoCode={sendingPromo.code}
          open={!!sendingPromo}
          onOpenChange={open => !open && setSendingPromo(null)}
        />
      )}

      {/* ===========================
          🔥 Delete Confirmation Modal
      =========================== */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promo Code?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this promo code? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (!deleteId) return

                deletePromo.mutate(deleteId, {
                  onSuccess: () => {
                    toast.success('Promo code deleted successfully!')
                    setDeleteId(null)
                  },
                  onError: (error: any) => {
                    toast.error(error.message || 'Failed to delete promo code')
                    setDeleteId(null)
                  },
                })
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
