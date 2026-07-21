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
import { BookingsResponse } from "@/types/bookings/bookingTypes";
import { useBookingsFilter } from "./states/useBookingsFilter";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal } from "lucide-react";

import BookingCard from "./booking-card";
import MessageCustomerButton from "@/components/message-customer-button";

interface Props {
  token: string;
  userID: string;
}

const BookingsTable = ({ token }: Props) => {
  const [page, setPage] = React.useState(1);

  const { search, startDate, endDate, deliveryType, status } = useBookingsFilter();

  const { data, isLoading, isFetching } = useQuery<BookingsResponse>({
    queryKey: ["all-bookings", page, search, startDate, endDate, deliveryType, status],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/allocated?page=${page}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
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

  const apiBookings = React.useMemo(() => data?.data ?? [], [data?.data]);

  // Helper function to get current status from statusHistory
  const getCurrentStatus = (
    statusHistory: Array<{ status: string; timestamp: string; _id: string }>
  ) => {
    if (!statusHistory || statusHistory.length === 0) return "Unknown";
    // Sort by timestamp descending and get the latest status
    const sorted = [...statusHistory].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return sorted[0].status;
  };

  const formatStatus = (status?: string) => {
    if (!status) return "Pending";
    return status.replace(/([A-Z])/g, " $1").trim();
  };

  // Frontend filtering for deliveryType and specific status checks if backend doesn't handle them perfectly
  const bookings = React.useMemo(() => {
    let filtered = [...apiBookings];

    // Filter out manual bookings for this tab
    filtered = filtered.filter(b => !b.isManualBooking);

    if (deliveryType) {
      if (deliveryType === "Local Pickup") {
        filtered = filtered.filter(b => b.deliveryMethod === "Pickup");
      } else {
        filtered = filtered.filter(b => b.deliveryMethod === deliveryType);
      }
    }

    if (status) {
      filtered = filtered.filter(b => {
        if (status === "Pending") {
          return b.deliveryStatus === "Pending";
        }

        // For other statuses, check all relevant fields to be safe
        const currentStatus = getCurrentStatus(b.statusHistory);
        return (
          (b.paymentStatus === status) ||
          (b.deliveryStatus === status) ||
          (currentStatus === status) ||
          (formatStatus(b.deliveryStatus) === status)
        );
      });
    }

    return filtered;
  }, [apiBookings, deliveryType, status]);

  const paginationInfo = data?.pagination;



  // Helper function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-200";
      case "ShippedToCustomer":
        return "text-blue-600 bg-blue-200";
      case "Paid":
        return "text-green-600 bg-green-200";
      case "AcceptedByLender":
      case "Accepted by Lender":
        return "text-green-600 bg-green-200";
      default:
        if (status.includes("Rejected")) {
          return "text-red-600 bg-red-200";
        }
        return "text-gray-600 bg-gray-200";
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] min-w-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="w-[100px] text-center">Order ID</TableHead>
                <TableHead className="w-[100px] text-center">
                  Dress Name
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Customer Name
                </TableHead>
                <TableHead className="w-[100px] text-center">Price</TableHead>
                <TableHead className="w-[100px] text-center">
                  Rental Period
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Delivery Type
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Payment Status
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Status
                </TableHead>
                <TableHead className="w-[100px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading || isFetching ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j} className="text-center">
                        <Skeleton className="h-5 w-20 mx-auto" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : bookings.length > 0 ? (
                bookings.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="text-center font-medium">
                      {item?._id?.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.dressName}
                    </TableCell>
                    <TableCell className="text-center">
                      {item?.customer?.firstName ? (
                        `${item.customer.firstName} ${item.customer.lastName ? `${item.customer.lastName.charAt(0)}.` : ""}`.trim()
                      ) : (
                        item?.customer?.email || "N/A"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      ${item?.totalAmount}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span>
                          {new Date(item?.rentalStartDate).toLocaleDateString()}
                        </span>
                        <span className="text-gray-500">to</span>
                        <span>
                          {new Date(item?.rentalEndDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({item?.rentalDurationDays} days)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-800 max-w-[80px] break-words leading-tight inline-block">
                          {item?.deliveryMethod}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${item?.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                          }`}
                      >
                        {item?.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                          item?.deliveryStatus
                        )}`}
                      >
                        {formatStatus(item?.deliveryStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <MessageCustomerButton
                                  bookingId={item?._id}
                                  accessToken={token}
                                  iconOnly
                                  variant="ghost"
                                  className="text-neutral-500 hover:text-primary hover:bg-primary/5"
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs font-medium">Message Customer</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-neutral-500 hover:text-primary hover:bg-primary/5"
                                asChild
                              >
                                <Link href={`/bookings/${item?._id}`}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs font-medium">View Booking Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-500"
                  >
                    No bookings found
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
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="pt-4 border-t flex justify-between items-center">
                <Skeleton className="h-8 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            </div>
          ))
        ) : bookings.length > 0 ? (
          bookings.map((item) => (
            <BookingCard key={item._id} item={item} token={token} />
          ))
        ) : (
          <div className="bg-white p-10 rounded-xl text-center text-gray-500 shadow-sm border border-gray-100">
            No bookings found
          </div>
        )}
      </div>

      {paginationInfo && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm bg-white p-4 rounded-lg shadow-sm">
          <span>
            Page {paginationInfo?.currentPage} of {paginationInfo?.totalPages} •{" "}
            {paginationInfo?.totalItems} records
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= paginationInfo?.totalPages}
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

export default BookingsTable;
