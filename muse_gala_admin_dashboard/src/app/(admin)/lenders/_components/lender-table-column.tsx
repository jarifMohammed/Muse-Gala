import { cn } from '@/lib/utils'
import { LenderProfile } from '@/types/lender'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import LenderAction from './actions/lender-action'

export const lenderTableColumns: ColumnDef<LenderProfile>[] = [
  {
    accessorKey: 'fullName',
    header: 'Lender Name',
    cell: ({ row }) => {
      const fullName = row.original?.fullName || 'Guest'
      return <div>{fullName}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <div
          className={cn(
            status === 'approved'
              ? 'bg-green-100 text-green-800'
              : status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800',
            'w-fit px-2 py-1 rounded-[50px] mx-auto '
          )}
        >
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: 'businessName',
    header: 'Business Name',
    cell: ({ row }) => {
      const businessName = row.original?.businessName || 'N/A'
      return <div>{businessName}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined At',
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      return <div>{moment(createdAt).format('D MMMM, YYYY hh:mm A')}</div>
    },
  },

  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      return <LenderAction data={row.original} />
    },
  },
]
