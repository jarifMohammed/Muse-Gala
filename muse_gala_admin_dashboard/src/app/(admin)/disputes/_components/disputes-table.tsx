/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DisputesModal from "./disputes-modal";
import { useQuery } from "@tanstack/react-query";

const DisputesTable = ({ token }: { token: string }) => {
  const [page, setPage] = useState(1);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["all-disputes", page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/all?page=${page}`,
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

  const disputes = data?.disputes || [];
  const paginationInfo = data
    ? {
        currentPage: data.page,
        totalPages: data.pages,
        totalData: data.total,
        hasPrevPage: data.page > 1,
        hasNextPage: data.page < data.pages,
      }
    : null;

  const handleViewDispute = (disputeId: string) => {
    setSelectedDisputeId(disputeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDisputeId(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: "bg-yellow-200 text-yellow-800",
      Escalated: "bg-orange-200 text-orange-800",
      Resolved: "bg-green-200 text-green-800",
    };

    const className =
      statusConfig[status as keyof typeof statusConfig] ||
      "bg-gray-200 text-gray-800";

    return (
      <button
        className={`px-2 rounded-3xl font-semibold text-xs py-1 ${className}`}
      >
        {status}
      </button>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Skeleton rows for loading state
  const SkeletonRow = () => (
    <TableRow>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-20 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-24 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-24 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-32 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-6 w-20 mx-auto rounded-full" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-16 mx-auto" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-8 w-20 mx-auto" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A]">
      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="text-center">Dispute ID</TableHead>
            <TableHead className="text-center">Customer</TableHead>
            <TableHead className="text-center">Lender</TableHead>
            <TableHead className="text-center">Issue</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Dispute Date</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Show 5 skeleton rows when loading
            Array.from({ length: 10 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))
          ) : disputes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No disputes found
              </TableCell>
            </TableRow>
          ) : (
            disputes.map((dispute: any) => (
              <TableRow key={dispute?._id}>
                <TableCell className="text-center text-sm font-mono">
                  {dispute?._id}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 block truncate">
                      {dispute?.booking?.customer?.firstName}{" "}
                      {dispute?.booking?.customer?.lastName}
                    </span>
                    <span className="text-xs text-gray-500 font-mono block truncate">
                      {dispute?.booking?.customer?._id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 block truncate">
                      {dispute?.booking?.lender?.firstName}{" "}
                      {dispute?.booking?.lender?.lastName}
                    </span>
                    <span className="text-xs text-gray-500 font-mono block truncate">
                      {dispute?.booking?.lender?._id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {dispute?.issueType}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(dispute?.status)}
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(dispute?.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    onClick={() => handleViewDispute(dispute?._id)}
                    size="sm"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {paginationInfo && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Page {paginationInfo?.currentPage} of {paginationInfo?.totalPages} •{" "}
            {paginationInfo?.totalData} records
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!paginationInfo?.hasPrevPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!paginationInfo?.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Skeleton Pagination */}
      {isLoading && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      )}

      {/* Custom Modal */}
      <DisputesModal
        id={selectedDisputeId}
        token={token}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DisputesTable;