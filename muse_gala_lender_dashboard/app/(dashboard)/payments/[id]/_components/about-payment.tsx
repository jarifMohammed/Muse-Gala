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
  lenderPrice?: number;
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
        <h1 className="text-xl font-medium">Payment Details</h1>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          Status:{" "}
          {bookingDetails?.statusHistory?.map((status) => (
            <span key={status?._id}>{status?.status}</span>
          ))}
        </div>

        <h1>Method: {bookingDetails?.deliveryMethod ?? "N/A"}</h1>
        <h1>Transaction ID: N/A</h1>
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
