"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookingsCard from "./bookings-card";

interface BookingsHeaderProps {
  bookings: {
    totalBookings?: number;
    totalBookingAmount?: number;
    totalRevenue?: number;
    pendingDeliveries?: number;
  };
}

const BookingsHeader = ({ bookings }: BookingsHeaderProps) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-[25px] tracking-[0.5rem] uppercase font-medium">
          Manage Bookings
        </h1>
        <Link href="/returns">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Late Returns Analytics
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        <BookingsCard
          title="Total Bookings"
          value={`${bookings.totalBookings || 0}`}
          isLoading={false}
        />
        <BookingsCard
          title="Total Bookings Amount"
          value={`$ ${bookings.totalBookingAmount || 0}`}
          isLoading={false}
        />
        <BookingsCard
          title="Total Revenue"
          value={`$ ${bookings.totalRevenue || 0}`}
          isLoading={false}
        />
        <BookingsCard
          title="Pending Deliveries"
          value={`${bookings.pendingDeliveries || 0}`}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default BookingsHeader;
