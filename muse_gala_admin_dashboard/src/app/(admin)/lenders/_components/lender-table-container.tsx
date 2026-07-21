'use client'
import { DataTable } from '@/components/ui/data-table'
import { PaginationControls } from "@/components/ui/pagination-controls";
import useDebounce from '@/hook/useDebounce'
import { LenderProfile, LendersGetResponse } from '@/types/lender'
import { useQuery } from '@tanstack/react-query'

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { lenderTableColumns } from './lender-table-column'
import { useLenderSearchStore } from './state'

interface LenderTableContainerProps {
  accessToken: string
}

const LenderTableContainer = ({ accessToken }: LenderTableContainerProps) => {
  const { page, value, status, dateRange } = useLenderSearchStore()

  const debouncedValue = useDebounce(value, 500)

 const { data, isLoading, isError, error } = useQuery<LendersGetResponse>({
  queryKey: ['lenders', page, debouncedValue, status, dateRange],
  queryFn: () =>
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/application?page=${page}&limit=5&search=${
        encodeURIComponent(debouncedValue)
      }&status=${status}&startDate=${
        dateRange.from ? new Date(dateRange.from).toISOString() : ''
      }&endDate=${
        dateRange.to ? new Date(dateRange.to).toISOString() : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }),
}); 

  let content

  if (isLoading) {
    content = (
      <div className="rounded-md border bg-white p-4 space-y-3">
        {/* 7 Skeleton Rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-full bg-gray-100 rounded animate-pulse"
          ></div>
        ))}
      </div>
    )
  } else if (isError) {
    content = (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-red-600 dark:text-red-400 text-center space-y-2">
        <AlertTriangle size={32} />
        <p className="text-lg font-medium">Failed to load documents</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {error?.message || 'Something went wrong. Please try again later.'}
        </p>
      </div>
    )
  } else if (data?.data) {
    content = (
      <TableContainer
        data={data.data.data}
        columns={lenderTableColumns}
        pagination={data.data.pagination}
      />
    )
  }

  return <div>{content}</div>
}

export default LenderTableContainer

interface TableProps {
  data: LenderProfile[]
  columns: ColumnDef<LenderProfile>[]
  pagination: {
    currentPage?: number;
    page?: number;     // optional alternative
    totalPages?: number;
    pages?: number;    // optional alternative
    totalItems?: number;
    total?: number;    // optional alternative
    itemsPerPage?: number;
    limit?: number;    // optional alternative
  }
}

const TableContainer = ({ data, columns, pagination }: TableProps) => {
  const { page, setPage } = useLenderSearchStore();
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  return (
    <>
      <div className="bg-white">
        <DataTable table={table} columns={columns} />
      </div>
      {(pagination.totalPages || pagination.pages || 1) > 1 && (
        <div className="mt-4 w-full  flex justify-end">
          <PaginationControls
                currentPage={page || pagination.currentPage || pagination.page || 1}
                totalPages={pagination.totalPages || pagination.pages || 1}
                totalItems={pagination.totalItems || pagination.total || 0}
                itemsPerPage={pagination.itemsPerPage || pagination.limit || 5}
                onPageChange={(p) => setPage(p)}
              />
        </div>
      )}
    </>
  )
}
