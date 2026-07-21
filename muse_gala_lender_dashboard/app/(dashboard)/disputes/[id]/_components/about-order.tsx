"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface RentalPrice {
  fourDays?: number;
  eightDays?: number;
}

interface Listing {
  media?: string[];
  dressId?: string;
  brand?: string;
  rentalPrice?: RentalPrice;
}

interface Booking {
  listing?: Listing;
}

interface DisputeDetails {
  booking?: Booking;
}

interface AboutOrderProps {
  disputesDetails?: DisputeDetails | null;
  isLoading: boolean;
}

const AboutOrder: React.FC<AboutOrderProps> = ({ disputesDetails, isLoading }) => {
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

  const listing = disputesDetails?.booking?.listing;

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">Order Items</h1>
      </div>

      <div className="mt-4 flex items-start gap-4">
        <div>
          <Image
            src={listing?.media?.[0] ?? "/placeholder.png"}
            alt="listing image"
            width={1000}
            height={1000}
            className="h-[150px] w-[150px] object-cover rounded-md"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-lg font-medium">
            Dress ID: {listing?.dressId ?? "N/A"}
          </h1>
          <h1>Brand: {listing?.brand ?? "N/A"}</h1>
          <h1>
            Price: ${listing?.rentalPrice?.fourDays ?? 0} (four days)
          </h1>
          <h1>
            Price: ${listing?.rentalPrice?.eightDays ?? 0} (eight days)
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AboutOrder;
