// ================================================================
// disputes-tab.tsx (Refactored - No Pagination)
// ================================================================
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DisputeData, disputeTableColumns } from './dispute-table-columns'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'

interface Props {
  data: DisputeData[] // disputes array
}

interface DisputesTableProps {
  data: DisputeData[] // array of dispute items
  columns: ColumnDef<DisputeData>[]
}

const DisputesTab = ({ data }: Props) => {
  // console.log('disputes data', data)

  return (
    <div className="space-y-6 w-full">
      <Card className="shadow-none rounded-[6px] w-full">
        <CardHeader>
          <CardTitle className="font-light font-sans">
            Customer Disputes
          </CardTitle>
        </CardHeader>

        <CardContent className="font-light text-[14px] font-sans">
          {data && data.length > 0 ? (
            <DisputesTable data={data} columns={disputeTableColumns} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No disputes found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DisputesTab

// ================================================================
// TABLE COMPONENT
// ================================================================
export const DisputesTable = ({ data, columns }: DisputesTableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="bg-white">
      <div className="max-h-[500px] overflow-auto border rounded-md">
        <DataTable table={table} columns={columns} />
      </div>
    </div>
  )
}
