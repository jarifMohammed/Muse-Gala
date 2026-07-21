"use client";

import { BookingsResponse } from "@/types/bookings/bookingTypes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AboutAnalytics from "./dispute-description";
import DisputeForm from "./dispute-form";
import AboutDisputes from "./about-dispute";
import DisputeReason from "./dispute-reason";
import DisputeDescription from "./dispute-description";
import MediaEvidence from "./media-evidence";
import DisputeTimeline from "./dispute-timeline";
import DisputeAction from "./dispute-action";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

const DisputesDetails = ({ token }: Props) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const { data: disputesDetails = {}, isLoading } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
  });

  return (
    <div>
      <div className="mb-4">
        <Button
          className="p-0 h-auto hover:bg-transparent"
          effect="expandIcon"
          icon={MoveLeft}
          iconPlacement="left"
          variant="link"
          onClick={() => router.back()}
        >
          Back Now
        </Button>
      </div>

      <div>
        <h1 className="tracking-widest uppercase font-medium text-xl mb-8">
          Dispute Details
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <AboutDisputes
          disputesDetails={disputesDetails}
          isLoading={isLoading}
        />
        <DisputeReason
          disputesDetails={disputesDetails}
          isLoading={isLoading}
        />
        <DisputeDescription
          disputesDetails={disputesDetails}
          isLoading={isLoading}
        />
        <MediaEvidence
          disputesDetails={disputesDetails}
          isLoading={isLoading}
        />
        <DisputeTimeline
          disputesDetails={disputesDetails}
          isLoading={isLoading}
        />
      </div>

      <div>
        <DisputeAction />
      </div>
    </div>
  );
};

export default DisputesDetails;
