"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

type BookingDetails = {
  issueType?: string;
  escalationReason?: string;
};

type AboutBookingProps = {
  disputesDetails?: BookingDetails;
  isLoading?: boolean;
};

const DisputeReason: React.FC<AboutBookingProps> = ({
  disputesDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-4 md:p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-lg md:text-xl font-medium">Dispute Reasons</h1>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original Reason</p>
          <p className="text-sm mt-1">{disputesDetails?.issueType || "N/A"}</p>
        </div>

        {disputesDetails?.escalationReason && (
          <div className="pt-3 border-t">
            <p className="text-xs font-semibold text-black uppercase tracking-wider">Escalation Reason</p>
            <p className="text-sm mt-1">{disputesDetails.escalationReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeReason;
