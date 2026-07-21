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
  rentalStartDate?: string;
  rentalEndDate?: string;
  lenderPrice?: number;
  createdAt?: string;
};

type AboutBookingProps = {
  bookingDetails?: BookingDetails;
  isLoading?: boolean;
};

const AboutBooking: React.FC<AboutBookingProps> = ({
  bookingDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">
          Booking ID: {bookingDetails?.id}
        </h1>
        <button>
          {bookingDetails?.statusHistory?.map((status) => (
            <span
              key={status?._id}
              className={`px-2 rounded-3xl font-semibold text-xs py-1 ${status?.status === "Pending"
                ? "text-orange-600 bg-orange-200"
                : status?.status === "Approved"
                  ? "text-green-600 bg-green-200"
                  : status?.status === "Rejected"
                    ? "text-red-600 bg-red-200"
                    : "text-gray-600 bg-gray-200"
                }`}
            >
              {status?.status}
            </span>
          ))}
        </button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <h1>Customer ID: {bookingDetails?.customer?._id ?? "N/A"}</h1>
        <h1>Dress: {bookingDetails?.listing?.dressName ?? "N/A"}</h1>
        <h1>
          Rental Period:{" "}
          {bookingDetails?.rentalStartDate
            ? new Date(bookingDetails.rentalStartDate).toLocaleDateString()
            : "N/A"}{" "}
          -{" "}
          {bookingDetails?.rentalEndDate
            ? new Date(bookingDetails.rentalEndDate).toLocaleDateString()
            : "N/A"}
        </h1>
        <h1>Price: ${bookingDetails?.lenderPrice ?? 0}</h1>
        <h1>
          Order Date:{" "}
          {bookingDetails?.createdAt
            ? new Date(bookingDetails.createdAt).toLocaleDateString()
            : "N/A"}
        </h1>
      </div>
    </div>
  );
};

export default AboutBooking;
