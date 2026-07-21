"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { usePaymentsFilter } from "./states/usePaymentsFilter";
import PayoutMobileCard from "./payout-mobile-card";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  token: string;
}

type Payout = {
  _id: string;
  lenderId: string;
  bookingId: string;
  bookingAmount: number;
  lenderPrice: number;
  requestedAmount: number;
  commission: number;
  status: string;
  requestedAt: string;
};

type PayoutsResponse = {
  payouts: Payout[];
  total: number;
  page: number;
  limit: number;
};

const PaymentsTable = ({ token }: Props) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const { search, status, date } = usePaymentsFilter();

  const { data, isLoading, isFetching } = useQuery<PayoutsResponse>({
    queryKey: ["payouts-all"],
    queryFn: async () => {
      // Fetching a large number of items for client-side filtering
      // Adjust limit as necessary or remove if API supports it
      const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/my`);
      url.searchParams.append("page", "1");
      url.searchParams.append("limit", "1000");

      const res = await fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      return json.data;
    },
  });

  const allPayouts = data?.payouts ?? [];

  // Client-side filtering
  const filteredPayouts = React.useMemo(() => {
    return allPayouts.filter((item) => {
      const searchTerm = search.toLowerCase().trim();
      const searchMatch = !searchTerm ||
        String(item.bookingId).toLowerCase().includes(searchTerm) ||
        String(item._id).toLowerCase().includes(searchTerm);

      const statusMatch = !status || item.status === status;

      const dateMatch = !date || new Date(item.requestedAt).toLocaleDateString() === new Date(date).toLocaleDateString();

      return searchMatch && statusMatch && dateMatch;
    });
  }, [allPayouts, search, status, date]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, status, date]);

  // Client-side pagination
  const paginatedPayouts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayouts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayouts, currentPage]);

  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);

  return (
    <div className="mt-8 space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">Payout ID</TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Booking ID
                </TableHead>
                <TableHead className="hidden md:table-cell text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Dress Price
                </TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Req. Amount
                </TableHead>
                <TableHead className="hidden lg:table-cell text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Commission
                </TableHead>
                <TableHead className="hidden md:table-cell text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Requested At
                </TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading || isFetching ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedPayouts.length > 0 ? (
                paginatedPayouts.map((item) => (
                  <TableRow key={item._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-center font-mono text-xs">{item._id}</TableCell>
                    <TableCell className="text-center text-sm">{item.bookingId}</TableCell>
                    <TableCell className="hidden md:table-cell text-center text-sm font-medium">
                      ${item.lenderPrice || item.bookingAmount}
                    </TableCell>
                    <TableCell className="text-center text-sm font-bold text-black">
                      ${item.requestedAmount}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center text-sm text-gray-600">
                      {item.commission}%
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center text-sm text-gray-500">
                      {new Date(item.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${item.status === "pending"
                            ? "text-orange-700 bg-orange-100 border border-orange-200"
                            : "text-green-700 bg-green-100 border border-green-200"
                          }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No payouts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading || isFetching ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="shadow-sm border-none bg-white py-4 px-4 space-y-4 rounded-xl">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </Card>
          ))
        ) : paginatedPayouts.length > 0 ? (
          paginatedPayouts.map((item) => (
            <PayoutMobileCard key={item._id} payout={item} />
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center text-gray-400 italic">
            No payouts found
          </div>
        )}
      </div>

      {filteredPayouts.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm bg-white md:bg-transparent p-4 md:p-0 rounded-xl shadow-sm md:shadow-none">
          <span className="text-gray-500">
            Page <span className="font-bold text-black">{currentPage}</span> of <span className="font-bold text-black">{totalPages}</span> •{" "}
            <span className="font-bold text-black">{filteredPayouts.length}</span> records
          </span>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none h-11 md:h-9 font-bold"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none h-11 md:h-9 font-bold"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsTable;
