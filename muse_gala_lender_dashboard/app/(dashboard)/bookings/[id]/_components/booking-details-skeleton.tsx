import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const BookingDetailsSkeleton = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-20 rounded-3xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
};

export default BookingDetailsSkeleton;
