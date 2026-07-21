// ================================================================
// CustomerTableContainer.tsx
// ================================================================
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PaginationInfo, TableContainer } from './table-container'
import { customerTableColumns, CustomerProfile } from './customer-table-column'
import SkeletonLoader from '@/components/loader/SkeletonLoader'

interface CustomerTableContainerProps {
  accessToken: string
}

interface CustomerListResponse {
  status: boolean
  message: string
  data: {
    customers: CustomerProfile[]
    pagination: PaginationInfo
  }
}

export default function CustomerTableContainer({
  accessToken,
}: CustomerTableContainerProps) {
  const [page, setPage] = useState(1)

  const fetchCustomers = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/customer/all-customers?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const res: CustomerListResponse = await response.json()

    if (!res.status) throw new Error('Failed to fetch customers')

    return {
      customers: res.data.customers,
      pagination: res.data.pagination,
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', page],
    queryFn: fetchCustomers,
  })

  if (isLoading) return <SkeletonLoader />

  if (error)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">{(error as Error).message}</div>
      </div>
    )

  return (
    <TableContainer
      data={data!}
      columns={customerTableColumns}
      onPageChange={(newPage) => setPage(newPage)}
    />
  )
}
