import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type LiveListingType = {
  _id: string;
  thumbnail: string;
  masterDressId: string;
  brand: string;
  price: string;
  dressName?: string;
};

type liveListingsProps = {
  liveListings: LiveListingType[];
  isLoading: boolean;
};

const LiveListings = ({ liveListings, isLoading }: liveListingsProps) => {
  const ListingSkeleton = () => (
    <div className="flex bg-[#FEFAF6]">
      <Skeleton className="w-20 h-24 rounded-l-[8px]" />

      <div className="flex-1 px-4 pt-2 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 sm:p-7 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A] mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Live Listings</h3>
        <Link
          href="/listings"
          className="text-sm text-gray-500 hover:underline"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ListingSkeleton key={index} />
          ))
        ) : liveListings?.length > 0 ? (
          liveListings.map((dress) => (
            <div key={dress?._id} className="flex bg-[#FEFAF6]">
              <div className="w-20 h-24 overflow-hidden">
                <Image
                  src={dress?.thumbnail || "/placeholder.svg"}
                  alt={`dress.png`}
                  width={80}
                  height={96}
                  className="object-cover w-full h-full rounded-l-[8px]"
                />
              </div>
              <div className="px-4 pt-2 rounded-r-[8px] flex-1 min-w-0">
                <p className="font-medium truncate break-all">{dress?.dressName || `DRESS ID : ${dress?.masterDressId}`}</p>
                <p className="text-sm truncate">
                  Brand: {dress?.brand || "Non vel ad officia d"}
                </p>
                <p className="text-sm truncate">Price: {dress?.price || "132"}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No live listings found
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveListings;
