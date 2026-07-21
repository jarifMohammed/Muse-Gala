"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

type StatusHistory = {
  _id: string;
  status: string;
};

export type BookingDetails = {
  id?: string;
  _id?: string;
  statusHistory?: StatusHistory[];
  deliveryStatus?: string;
  customer?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  dressName?: string;
  brand?: string;
  dressId?: string | { brand?: string };
  masterdressId?: string | { brand?: string };
  size?: string;
  color?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  totalAmount?: number;
  createdAt?: string;
  lenderPrice?: number;
  shippingAddress?: string | {
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    address?: string;
  };
  pickupLocation?: string;
  address?: string; // Fallback for some API responses
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

  const formatStatus = (status?: string) => {
    if (!status) return "Pending";
    return status.replace(/([A-Z])/g, " $1").trim();
  };

  const formatAddress = (address: any) => {
    if (!address) return "N/A";
    if (typeof address === "string") return address;
    const { street, city, state, postcode, address: addr } = address;
    if (addr) return addr;
    return [street, city, state, postcode].filter(Boolean).join(", ") || "N/A";
  };

  // Check shippingAddress, then pickupLocation, then top-level address fallback
  const displayAddress = formatAddress(
    bookingDetails?.shippingAddress ||
    bookingDetails?.pickupLocation ||
    bookingDetails?.address
  );

  // Fallback check for brand inside populated objects
  const displayBrand =
    bookingDetails?.brand ||
    (typeof bookingDetails?.dressId === "object" ? bookingDetails.dressId.brand : null) ||
    (typeof bookingDetails?.masterdressId === "object" ? bookingDetails.masterdressId.brand : null) ||
    "N/A";

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium break-all">
          Customer Name: {bookingDetails?.customer?.firstName} {bookingDetails?.customer?.lastName ? `${bookingDetails.customer.lastName.charAt(0)}.` : ""}
        </h1>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          Status:{" "}
          <span className="font-semibold">
            {formatStatus(bookingDetails?.deliveryStatus)}
          </span>
        </div>
        <h1 className="break-all">Booking ID: {bookingDetails?._id || bookingDetails?.id}</h1>
        <h1 className="break-all">Customer ID: {bookingDetails?.customer?._id ?? "N/A"}</h1>
        <h1>Dress: {bookingDetails?.dressName ?? "N/A"}</h1>
        <h1>Brand: {displayBrand}</h1>
        <h1>Size: {bookingDetails?.size ?? "N/A"}</h1>
        <h1>Color: {bookingDetails?.color ?? "N/A"}</h1>
        <h1 className="break-all">Address: {displayAddress}</h1>
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
