"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const DisputesDetails = () => {
  const { id } = useParams();

  const session = useSession();
  const token = session.data?.user.accessToken;

  const { data: disputeDetails = {}, isLoading } = useQuery({
    queryKey: ["disputes-details"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/disputes/my-disputes/${id}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      return data?.data || {};
    },
  });

  if (isLoading)
    return (
      <div className="font-avenir tracking-widest opacity-80">
        <div className="border border-gray-500 p-5 space-y-10">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[180px]" />
            <Skeleton className="h-5 w-[200px]" />
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-7 w-[100px] rounded-3xl" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="font-avenir tracking-widest opacity-80">
      <div className="border border-gray-500 p-5">
        <div className="flex items-center justify-between">
          <h1>Order ID : {disputeDetails?.booking?._id}</h1>
          <h1>
            Date Submitted :{" "}
            {new Date(disputeDetails?.createdAt as string).toLocaleDateString()}{" "}
          </h1>
        </div>

        <div className="flex items-center justify-between mt-10">
          <h1>Issue Type: {disputeDetails?.issueType}</h1>
          <button
            className={`font-bold rounded-3xl py-1 px-2 text-sm ${
              disputeDetails?.status === "Pending" &&
              "bg-yellow-100 text-yellow-700"
            } ${
              disputeDetails?.status === "Resolved" &&
              "bg-green-100 text-green-700"
            }`}
          >
            {disputeDetails?.status}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisputesDetails;
