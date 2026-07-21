"use client";

import { Skeleton } from "@/components/ui/skeleton";

const DisputeCardSkeleton = () => {
  return (
    <div className="font-avenir tracking-widest opacity-80">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-3xl" />
      </div>

      <div className="my-2">
        <Skeleton className="h-4 w-40 rounded-md" />
      </div>

      <div className="mb-2">
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-10 rounded-md" />
      </div>
    </div>
  );
};

export default DisputeCardSkeleton;
