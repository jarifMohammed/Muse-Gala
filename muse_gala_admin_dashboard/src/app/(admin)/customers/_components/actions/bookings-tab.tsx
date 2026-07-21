// ================================================================
// bookings-tab.tsx
// ================================================================
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { bookingTableColumns } from './bookings-column'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'

interface BookingData {
  bookingId: string
  dressName: string
  thumbnail: string
  lenderId: string
  status: string
  price: number
  start: string
  end: string
  bookedAt: string
}

interface Props {
  data: BookingData[] // bookings array
}

interface BookingTableProps {
  data: BookingData[]
  columns: ColumnDef<BookingData>[]
}

const BookingsTab = ({ data }: Props) => {
  console.log('bookings data', data)

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full ">
        <CardHeader>
          <CardTitle className="font-light font-sans">
            Bookings History
          </CardTitle>
        </CardHeader>

        <CardContent className="font-light text-[14px] font-sans">
          {/* Table */}
          <BookingsTable
            data={data ?? []} // FIXED (only array passed)
            columns={bookingTableColumns}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingsTab

// ================================================================
// TABLE COMPONENT
// ================================================================
export const BookingsTable = ({ data, columns }: BookingTableProps) => {
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white">
      {/* Scrollable Table Wrapper */}
      <div className="max-h-[500px] overflow-auto border rounded-md">
        <DataTable table={table} columns={columns} />
      </div>
    </div>
  )
}
