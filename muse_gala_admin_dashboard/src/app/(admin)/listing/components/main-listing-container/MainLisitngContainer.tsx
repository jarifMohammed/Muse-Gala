'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyContainer from '@/components/ui/custom/empty-container'
import ErrorContainer from '@/components/ui/custom/error-container'
import FancyLoader from '@/components/ui/custom/fancy-loader'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import useDebounce from '@/hook/useDebounce'
import { useMainSiteListingState } from '@/state/listing/use-search-listing-state'
import { useQuery } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { mainListing } from '../../types/mainListingsTypes'
import { mainListingColumn } from './mainListingColumn'

interface Props {
  accessToken: string
}

interface ApiResponse {
  status: boolean
  message: string
  data: mainListing[]
  pagination: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
  }
}

const MainListingContainer = ({ accessToken }: Props) => {
  const { searchQuery, setPage, page } = useMainSiteListingState()
  const debouncedValue = useDebounce(searchQuery, 500)

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['main-listing', debouncedValue, page],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dresses?status=approved&limit=10&page=${page}&search=${debouncedValue}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then((res) => res.json()),
  })

  // console.log('Main listing data pagination:', data?.pagination)

  const table = useReactTable({
    data: data?.data ?? [],
    columns: mainListingColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  let content

  if (isLoading) {
    content = (
      <FancyLoader message="Fetching approved listings, please wait..." />
    )
  } else if (isError) {
    content = <ErrorContainer message={(error as Error).message} />
  } else if (data && data.data.length === 0) {
    content = <EmptyContainer message="No approved listings found." />
  } else if (data && data.data.length > 0) {
    content = (
      <div className="bg-white">
        <DataTable table={table} columns={mainListingColumn} />
      </div>
    )
  }

  return (
    <Card>
      <MainListingHeader />
      <CardContent>
        {content}
        {data?.pagination && (
          <div className="mt-4 w-full flex justify-end">
            <PaginationControls
              currentPage={data?.pagination?.currentPage}
              totalPages={data.pagination.totalPages}
              totalItems={data.pagination.totalItems}
              itemsPerPage={data.pagination.itemsPerPage}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MainListingContainer

const MainListingHeader = () => {
  const { searchQuery, setSearchQuery } = useMainSiteListingState()

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Approved Listings</CardTitle>
        <div className="flex items-center gap-x-5">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dress name"
          />
        </div>
      </div>
    </CardHeader>
  )
}
