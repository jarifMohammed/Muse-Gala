'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyContainer from '@/components/ui/custom/empty-container'
import ErrorContainer from '@/components/ui/custom/error-container'
import FancyLoader from '@/components/ui/custom/fancy-loader'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDebounce from '@/hook/useDebounce'
import { useLenderListingState } from '@/state/listing/use-lender-listing-state'
import { useQuery } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Listing } from '../../types/listingsTypes'
import { listingColumn } from '../listing-column'

interface Props {
  accessToken: string
}

type Status = 'All' | 'approved' | 'pending' | 'rejected'

interface APiProps {
  status?: boolean
  message?: string
  data?: Listing[]
  pagination?: {
    currentPage?: number
    itemsPerPage?: number
    totalItems?: number
    totalPages?: number
  }
}

const LenderListingContainer = ({ accessToken }: Props) => {
  const { approvalStatus, searchQuery, setPage, page } = useLenderListingState()
  const debouncedValue = useDebounce(searchQuery, 500)

  const { data, isLoading, isError, error } = useQuery<APiProps>({
    queryKey: ['lender-listing', approvalStatus, debouncedValue, page],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/admin?status=${approvalStatus}&limit=10&page=${page}&search=${debouncedValue}`,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((res) => res?.json?.())
        .catch(() => ({ data: [], pagination: {} })),
  })

  // console.log('Lender Listings Data:', data)

  const table = useReactTable({
    data: data?.data ?? [],
    columns: listingColumn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  let content

  if (isLoading) {
    content = <FancyLoader message="Fetching your listings, please wait..." />
  } else if (isError) {
    content = <ErrorContainer message={(error as Error)?.message ?? 'Error occurred'} />
  } else if (data?.data?.length === 0) {
    content = <EmptyContainer message="No listings found for your search." />
  } else if ((data?.data?.length ?? 0) > 0) {
    content = (
      <div className="bg-white">
        <DataTable table={table} columns={listingColumn} />
      </div>
    )
  }

  return (
    <Card>
      <LenderListingHeader />
      <CardContent>
        {content}
        {(data?.pagination?.totalPages ?? 0) >= 1 && (
          <div className="mt-4 w-full flex justify-end">
            <PaginationControls
              currentPage={data?.pagination?.currentPage ?? 1}
              totalPages={data?.pagination?.totalPages ?? 1}
              totalItems={data?.pagination?.totalItems ?? 0}
              itemsPerPage={data?.pagination?.itemsPerPage ?? 10}
              onPageChange={(page) => setPage?.(page)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LenderListingContainer

const LenderListingHeader = () => {
  const { approvalStatus, setApprovalStatus, searchQuery, setSearchQuery } =
    useLenderListingState() ?? {}

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Lender Site Listing</CardTitle>
        <div className="flex items-center gap-x-5">
          <Select
            value={approvalStatus}
            onValueChange={(val) => setApprovalStatus?.(val as Status)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={searchQuery ?? ''}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Search by dress name"
          />
        </div>
      </div>
    </CardHeader>
  )
}