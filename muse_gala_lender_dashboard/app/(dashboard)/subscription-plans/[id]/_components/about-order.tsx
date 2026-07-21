"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type StatusHistory = {
  _id: string;
  status: string;
};

type BookingDetails = {
  id?: string;
  statusHistory?: StatusHistory[];
  customer?: { _id?: string };
  listing?: { 
    dressName?: string;
    media?: string[];
    dressId?: string;
    brand?: string;
  };
  rentalStartDate?: string;
  rentalEndDate?: string;
  totalAmount?: number;
  createdAt?: string;
};

type AboutBookingProps = {
  bookingDetails?: BookingDetails;
  isLoading?: boolean;
};

const AboutOrder: React.FC<AboutBookingProps> = ({
  bookingDetails,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
        <div>
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="mt-4 flex items-start gap-4">
          <Skeleton className="h-[150px] w-[150px] rounded-md" />

          <div className="space-y-3 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">Order Items</h1>
      </div>

      <div className="mt-4 flex items-start gap-4">
        <div>
          <Image
            src={bookingDetails?.listing?.media?.[0] ?? "/placeholder.png"}
            alt="media.png"
            width={1000}
            height={1000}
            className="h-[150px] w-[150px]"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-medium">
            Dress ID : {bookingDetails?.listing?.dressId}
          </h1>
          <h1>Brand: {bookingDetails?.listing?.brand}</h1>
          <h1>Price: ${bookingDetails?.totalAmount ?? 0}</h1>
        </div>
      </div>
    </div>
  );
};

export default AboutOrder;
