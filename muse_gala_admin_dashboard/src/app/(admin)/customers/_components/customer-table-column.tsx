// ================================================================
// customer-table-column.tsx
// ================================================================
'use client'

import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import CustomerAction from './customer-action'

export interface CustomerProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  address?: string
  kycVerified?: boolean
  kycStatus?: string
  status?: string
  createdAt: string
  totalBookings: number
  totalSpent: number
}

// Table Columns
export const customerTableColumns: ColumnDef<CustomerProfile>[] = [
  {
    accessorKey: '_id',
    header: 'Customer ID',
  },
  {
    accessorKey: 'firstName',
    header: 'Customer Name',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.firstName} {row.original.lastName}
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'totalBookings',
    header: 'Total Bookings',
  },
  {
    accessorKey: 'totalSpent',
    header: 'Total Spent',
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined At',
    cell: ({ row }) => {
      return (
        <div>{moment(row.original.createdAt).format('D MMM YYYY hh:mm A')}</div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return <CustomerAction customerId={row.original._id} />
    },
  },
]
