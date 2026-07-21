"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DisputesCard from "./disputes-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const DisputesHeader = ({ token }: { token: string }) => {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["states-disputes"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data?.stats;
    },
  });

  return (
    <div>
      <div>
        <h1 className="text-[25px] tracking-[0.5rem] uppercase font-medium">
          Manage Disputes
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mt-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center space-y-3 p-6 border rounded-lg"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mt-8">
          <DisputesCard title="Total Disputes" value={data?.totalDisputes} />
          <DisputesCard
            title="Pending Disputes"
            value={data?.pendingDisputes}
          />
          <DisputesCard
            title="Resolved Disputes"
            value={data?.resolvedDisputes}
          />
          <DisputesCard title="Resolution Rate" value={data?.resolutionRate} />
          <DisputesCard
            title="Avg. Resolution Time"
            value={data?.avgResolutionTime}
          />
        </div>
      )}
    </div>
  );
};

export default DisputesHeader;
