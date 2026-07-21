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
import { useDisputesFilter } from "./states/useDisputesFilter";
import { DisputesResponse } from "@/types/disputes/DisputesResponse";
import DisputeMobileCard from "./dispute-mobile-card";
import { Card } from "@/components/ui/card";

interface Props {
  token: string;
}

const DisputesTable = ({ token }: Props) => {
  const [page, setPage] = React.useState(1);
  const { search, status } = useDisputesFilter();

  const { data, isLoading, isFetching } = useQuery<DisputesResponse>({
    queryKey: ["all-disputes"], // Remove page, search, status for client-side filtering
    queryFn: async () => {
      // Fetch more records for client-side filtering
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/my-disputes?limit=1000`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
  });

  const allDisputes = data?.disputes ?? [];

  // Client-side filtering
  const filteredDisputes = React.useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    return allDisputes.filter((item) => {
      const searchMatch = !searchTerm ||
        String(item.booking?._id).toLowerCase().includes(searchTerm) ||
        String(item._id).toLowerCase().includes(searchTerm);

      const statusMatch = status === "All" || item.status === status;

      return searchMatch && statusMatch;
    });
  }, [allDisputes, search, status]);

  // Client-side pagination
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredDisputes.length / itemsPerPage);
  const paginatedDisputes = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredDisputes.slice(start, start + itemsPerPage);
  }, [filteredDisputes, page]);

  // Reset to first page when search/status changes
  React.useEffect(() => {
    setPage(1);
  }, [search, status]);

  const disputes = data?.disputes ?? [];
  const paginationInfo = {
    currentPage: data?.page ?? 1,
    totalPages: data?.pages ?? 1,
    totalData: data?.total ?? 0,
    hasPrevPage: (data?.page ?? 1) > 1,
    hasNextPage: (data?.page ?? 1) < (data?.pages ?? 1),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-100";
      case "In Progress":
        return "text-blue-600 bg-blue-100";
      case "In Review":
        return "text-purple-600 bg-purple-100";
      case "Escalated":
        return "text-red-600 bg-red-100";
      case "Resolved":
        return "text-green-600 bg-green-100";
      case "Closed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">Date Submitted</TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Booking ID
                </TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Customer ID
                </TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                  Dispute Reason
                </TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">Status</TableHead>
                <TableHead className="text-center text-gray-500 font-semibold uppercase text-[10px] tracking-wider">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading || isFetching ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j} className="text-center">
                        <Skeleton className="h-5 w-20 mx-auto" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedDisputes.length > 0 ? (
                paginatedDisputes.map((dispute) => (
                  <TableRow key={dispute?._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-center text-sm">
                      {new Date(dispute?.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center text-sm">{dispute?.booking?._id}</TableCell>
                    <TableCell className="text-center text-sm font-mono">{dispute?.booking?.customer?._id}</TableCell>
                    <TableCell className="text-center text-sm">{dispute?.issueType}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${getStatusColor(dispute?.status)}`}
                      >
                        {dispute?.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/disputes/${dispute?._id}`}>
                        <Button size="sm" className="font-bold">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No disputes found
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
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </Card>
          ))
        ) : paginatedDisputes.length > 0 ? (
          paginatedDisputes.map((dispute) => (
            <DisputeMobileCard key={dispute?._id} dispute={dispute} getStatusColor={getStatusColor} />
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center text-gray-400 italic">
            No disputes found
          </div>
        )}
      </div>

      {filteredDisputes.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm bg-white md:bg-transparent p-4 md:p-0 rounded-xl shadow-sm md:shadow-none">
          <span className="text-gray-500">
            Page <span className="font-bold text-black">{page}</span> of <span className="font-bold text-black">{totalPages}</span> •{" "}
            <span className="font-bold text-black">{filteredDisputes.length}</span> records
          </span>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none h-11 md:h-9 font-bold"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 md:flex-none h-11 md:h-9 font-bold"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputesTable;
