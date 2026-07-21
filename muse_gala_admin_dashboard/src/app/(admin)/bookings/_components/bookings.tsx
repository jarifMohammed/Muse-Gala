/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BookingsHeader from "./BookingsHeader";
import SearchBookings from "./search-bookings";
import BookingsTable from "./bookings-table";
import { useState } from "react";
import { useFilterBooking } from "./states/useFilterBooking";
import { useQuery } from "@tanstack/react-query";

const Bookings = ({ token }: { token: string }) => {
  const [page, setPage] = useState(1);
  const { search, startDate, endDate } = useFilterBooking();

  const {
    data: bookingsData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["all-bookings", page, search, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        search: search || "",
        startDate: startDate || "",
        endDate: endDate || "",
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/overview/dashboard/bookings/stats?${params.toString()}`,
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
    enabled: !!token,
  });

  const unfilteredBookings = bookingsData.bookings || [];

  const bookings = unfilteredBookings.filter((booking: any) => {
    if (!startDate && !endDate) return true;

    const createdAt = new Date(booking.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Normalize dates for accurate range comparison
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    if (start && createdAt < start) return false;
    if (end && createdAt > end) return false;

    return true;
  });

  const paginationInfo = {
    currentPage: page,
    totalPages: Math.ceil((bookingsData.totalBookings || 0) / 10),
    totalData: bookingsData.totalBookings || 0,
    hasPrevPage: page > 1,
    hasNextPage: unfilteredBookings.length === 10,
  };

  return (
    <div>
      <BookingsHeader bookings={bookingsData} />
      <SearchBookings />
      <BookingsTable
        token={token}
        bookings={bookings}
        paginationInfo={paginationInfo}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default Bookings;