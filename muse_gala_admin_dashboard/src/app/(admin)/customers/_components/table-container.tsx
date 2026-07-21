// ================================================================
// table-container.tsx
// ================================================================
'use client'

import { DataTable } from '@/components/ui/data-table'
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { CustomerProfile } from './customer-table-column'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Card } from '@/components/ui/card'

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalData: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface Data {
  customers: CustomerProfile[]
  pagination: PaginationInfo
}

interface TableProps {
  data: Data
  columns: ColumnDef<CustomerProfile>[]
  onPageChange: (page: number) => void
}

export const TableContainer = ({ data, columns, onPageChange }: TableProps) => {
  const table = useReactTable({
    data: data.customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const pagination = data.pagination

  return (
    <Card className="pb-5">
      <div className="bg-white">
        <DataTable table={table} columns={columns} />
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 w-full flex justify-end">
          <PaginationControls
            itemsPerPage={10}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalData}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </Card>
  )
}
