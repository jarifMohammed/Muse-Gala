import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";
import React from "react";

interface StatesProps {
  data?: {
    totalRevenue?: string;
    totalRentals?: string;
    activeBookings?: string;
    liveListingsCount?: string;
  };
  isLoading: boolean;
}

const States = ({ data, isLoading }: StatesProps) => {
  const statCards = [
    {
      title: "Total Revenue",
      value: data?.totalRevenue,
      className: "bg-[#891d33] text-white",
    },
    {
      title: "Total Rental",
      value: data?.totalRentals,
    },
    {
      title: "Active Booking",
      value: data?.activeBookings,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-10">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm"
            )}
          >
            <div className="p-3 md:p-4 flex flex-col items-center">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ))
        : statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value as string}
            className={card.className}
          />
        ))}
    </div>
  );
};

export default States;
