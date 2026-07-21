"use client";
import React from "react";
import States from "./states";
import LiveListings from "./live-listings";
import Calendar from "./calendar";
import UpcomingOrder from "./upcoming-order";
import { useQuery } from "@tanstack/react-query";

const Overview = ({ token }: { token: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/overview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data?.data;
    },
  });

  const liveListings = data?.liveListings || [];
  const upcomingOrders = data?.upcomingOrders || [];

  return (
    <div>

      <div className="mb-10">
        <States data={data} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Upcoming Orders Section - 1/3 width on desktop */}
        <UpcomingOrder upcomingOrders={upcomingOrders} isLoading={isLoading} token={token} />

        {/* Live Listings Section - 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <LiveListings liveListings={liveListings} isLoading={isLoading} />
        </div>
      </div>

      {/* Calendar Section - Full width or consistent row below */}
      <div className="mb-10">
        <Calendar token={token} />
      </div>
    </div>
  );
};

export default Overview;
