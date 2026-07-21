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
  paymentStatus?: string;
  customer?: { _id?: string };
  listing?: { dressName?: string };
  deliveryMethod?: string;
  totalAmount?: number;
  lenderPrice?: number;
  createdAt?: string;
};

type AboutBookingProps = {
  bookingDetails?: BookingDetails;
  isLoading?: boolean;
};

const AboutPayment: React.FC<AboutBookingProps> = ({
  bookingDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium break-all">Payment Details</h1>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          Status:{" "}
          <span className="font-semibold capitalize">
            {bookingDetails?.paymentStatus ?? "Pending"}
          </span>
        </div>

        <h1>Method: {bookingDetails?.deliveryMethod ? bookingDetails.deliveryMethod.replace(/([A-Z])/g, ' $1').trim() : "N/A"}</h1>
        <h1>Dress Fees: ${bookingDetails?.lenderPrice ?? 0}</h1>
        <h1>
          Paid On:{" "}
          {bookingDetails?.createdAt
            ? new Date(bookingDetails.createdAt).toLocaleDateString()
            : "N/A"}
        </h1>
      </div>
    </div>
  );
};

export default AboutPayment;
