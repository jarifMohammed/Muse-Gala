"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

type StatusHistory = {
  _id: string;
  status: string;
};

type BookingDetails = {
  id?: string;
  statusHistory?: StatusHistory[];
  customer?: { _id?: string };
  listing?: { dressName?: string };
  deliveryMethod?: string;
  totalAmount?: number;
  createdAt?: string;
  rentalDurationDays?: number;
};

type AboutBookingProps = {
  bookingDetails?: BookingDetails;
  isLoading?: boolean;
};

const AboutAnalytics: React.FC<AboutBookingProps> = ({
  bookingDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">Analytics Snapshot</h1>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>Total Orders for this Dress: 12</div>

        <h1>Customer Order History: 3 orders</h1>
        <h1>Average Rental Duration: {bookingDetails?.rentalDurationDays} Days</h1>
      </div>
    </div>
  );
};

export default AboutAnalytics;
