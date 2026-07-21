"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type TimelineItem = {
  _id: string;
  type: string;
  timestamp: string;
  message: string;
};

const TimelineAndCommunication = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const {
    data: timelineAndCommunication = [],
    isLoading,
  } = useQuery<TimelineItem[]>({
    queryKey: ["timelineAndCommunication-details", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/disputes/my-disputes/${id}/timeline`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data?.data || [];
    },
    enabled: !!token && !!id,
  });

  if (isLoading) {
    // ✅ Skeleton Loader (5 items)
    return (
      <div className="font-avenir tracking-widest opacity-80">
        <div className="opacity-80 font-avenir tracking-widest border-b-2 border-gray-400 pb-4">
          <h1>Timeline & Communication</h1>
        </div>

        <div className="mt-8 lg:ml-16 space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <Skeleton className="h-12 w-12 rounded-3xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="font-avenir tracking-widest opacity-80">
      <div className="opacity-80 font-avenir tracking-widest border-b-2 border-gray-400 pb-4">
        <h1>Timeline & Communication</h1>
      </div>

      <div className="mt-8 lg:ml-16 space-y-8">
        {timelineAndCommunication.length === 0 ? (
          <p>No timeline data available.</p>
        ) : (
          timelineAndCommunication.map((item) => (
            <div key={item._id} className="flex items-center gap-10">
              <div className="h-12 w-12 rounded-3xl bg-black"></div>

              <div>
                <h1 className="uppercase text-xl">{item.type}</h1>

                <p className="my-2 flex items-center gap-5">
                  <span>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <span>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </p>

                <p>Issue reported: {item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimelineAndCommunication;
