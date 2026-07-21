import React from "react";
import { RevenueBreakdownType } from "./finance-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import RevenueBreakdownChart from "./revenue-breakdown-chart";

const RevenueBreakdown = ({
  revenueBreakdown,
  isLoading,
}: {
  revenueBreakdown: RevenueBreakdownType;
  isLoading: boolean;
}) => {
  const skeletonRows = Array.from({ length: 8 });

  const tableHeaders = [
    "Year",
    "Month",
    "Subscription Revenue",
    "Total Lender Payout",
    "Pending Payout",
    "Commission Earned",
    "Total Credit Issued",
    "Insurance Collected",
    "Shipping Fee Collected",
    "Platform Revenue",
  ];

  return (
    <div className="space-y-8">
      <div>
        <RevenueBreakdownChart revenueBreakdown={revenueBreakdown} />
      </div>

      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg">
        <h1 className="text-2xl font-medium mb-8">Revenue Breakdown</h1>

        <div className="border border-gray-200 rounded-lg mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableHead key={index} className="text-center">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                skeletonRows.map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`}>
                    {tableHeaders.map((_, cellIndex) => (
                      <TableCell
                        key={`skeleton-cell-${rowIndex}-${cellIndex}`}
                        className="text-center"
                      >
                        <Skeleton className="h-6 w-20 mx-auto" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : revenueBreakdown?.data?.monthly?.length > 0 ? (
                revenueBreakdown?.data?.monthly?.map((item, index) => (
                  <TableRow
                    key={`${item?.year}-${item?.month}-${index}`}
                    className="text-center"
                  >
                    <TableCell>{item?.year || "N/A"}</TableCell>
                    <TableCell>{item?.month || "N/A"}</TableCell>
                    <TableCell>{item?.subscriptionRevenue || "0"}</TableCell>
                    <TableCell>{item?.totalLenderPayout || "0"}</TableCell>
                    <TableCell>{item?.pendingPayout || "0"}</TableCell>
                    <TableCell>{item?.commissionEarned || "0"}</TableCell>
                    <TableCell>{item?.totalCreditIssued || "0"}</TableCell>
                    <TableCell>{item?.insuranceCollected || "0"}</TableCell>
                    <TableCell>{item?.shippingFeeCollected || "0"}</TableCell>
                    <TableCell>{item?.platformRevenue || "0"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableHeaders.length}
                    className="text-center py-8 text-gray-500"
                  >
                    No revenue data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
