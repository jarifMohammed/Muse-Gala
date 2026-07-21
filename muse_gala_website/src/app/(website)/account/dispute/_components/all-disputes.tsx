"use client";
import { useQuery } from "@tanstack/react-query";
import DisputeCard from "./dispute-card";
import DisputeCardSkeleton from "./dispute-card-skeleton";

type Dispute = {
  _id?: string;
  status?: "Pending" | "Resolved" | string;
  createdAt?: string;
  issueType?: string;
  description?: string;
};

const AllDisputes = ({ token }: { token: string }) => {
  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ["all-disputes"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/disputes/my-disputes`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      return data?.data?.disputes || [];
    },
  });

  return (
    <div className="mt-8 space-y-8">
      {isLoading ? (
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => (
            <DisputeCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        disputes?.map((dispute: Dispute) => (
          <DisputeCard key={dispute?._id} dispute={dispute} />
        ))
      )}
    </div>
  );
};

export default AllDisputes;
