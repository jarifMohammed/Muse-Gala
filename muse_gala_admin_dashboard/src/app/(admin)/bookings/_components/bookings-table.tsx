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
import { Skeleton } from "@/components/ui/custom/skeleton";
import BookingsModal from "./bookings-modal";

export interface BookingItem {
  _id: string;
  customer: string;
  customerName: string;
  listing: string;
  masterdressId: string;
  dressName: string;
  rentalStartDate: string;
  rentalEndDate: string;
  totalAmount: number;
  deliveryStatus: string;
  paymentStatus: string;
  payoutStatus: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    _id: string;
  }>;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface Props {
  token: string;
  bookings: BookingItem[];
  paginationInfo?: PaginationInfo;
  isLoading: boolean;
  isFetching: boolean;
  page: number;
  setPage: (value: any) => void;
}

const BookingsTable = ({
  bookings,
  paginationInfo,
  isLoading,
  isFetching,
  setPage,
  token,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string>();

  const handleBookings = (id: string) => {
    setIsOpen(true);
    setId(id);
  };

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]  font-sans text-gray-700 tracking-wider">
          <TableHeader>
            <TableRow className="border-none text-base">
              <TableHead className="text-center">Booking ID</TableHead>
              <TableHead className="text-center">Dress Name</TableHead>
              <TableHead className="text-center">Booking Date</TableHead>
              <TableHead className="text-center text-nowrap">Amount</TableHead>
              <TableHead className="text-center text-nowrap">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || isFetching ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j} className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((item) => (
                <TableRow key={item?._id}>
                  <TableCell className="text-center">{item?._id}</TableCell>
                  <TableCell className="text-center">
                    {item?.dressName || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {`$ ${item?.totalAmount}`}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-3 rounded-3xl font-semibold text-xs py-1 tracking-wider ${item?.deliveryStatus === "Delivered"
                        ? "text-green-600 bg-green-100"
                        : item?.deliveryStatus === "Pending"
                          ? "text-orange-600 bg-orange-100"
                          : item?.deliveryStatus === "CancelledByCustomer"
                            ? "text-red-600 bg-red-100"
                            : "text-slate-600 bg-slate-100"
                        }`}
                    >
                      {item?.deliveryStatus || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button onClick={() => handleBookings(item?._id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <BookingsModal
          isOpen={isOpen}
          setIsOpen={() => setIsOpen(false)}
          id={id as string}
          token={token as string}
        />
      </div>

      {paginationInfo && (
        <div className="flex justify-between items-center mt-4 text-base font-sans text-slate-600 px-8 ">
          <span>
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages} •{" "}
            {paginationInfo.totalData} records
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!paginationInfo.hasPrevPage}
              onClick={() => setPage((p: any) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!paginationInfo.hasNextPage}
              onClick={() => setPage((p: any) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
