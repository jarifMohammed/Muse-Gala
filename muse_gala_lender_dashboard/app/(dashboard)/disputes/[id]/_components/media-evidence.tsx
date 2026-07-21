"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";
import Image from "next/image";

type Media = {
  url: string;
  filename?: string;
};

type disputesDetails = {
  evidence?: Media[];
  escalationEvidence?: Media[];
};

type AboutBookingProps = {
  disputesDetails?: disputesDetails;
  isLoading?: boolean;
};

const MediaEvidence: React.FC<AboutBookingProps> = ({
  disputesDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  const allEvidence = [
    ...(disputesDetails?.evidence?.map((e) => ({ ...e, type: "Original" })) || []),
    ...(disputesDetails?.escalationEvidence?.map((e) => ({
      ...e,
      type: "Escalation",
    })) || []),
  ];

  return (
    <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-xl font-medium">Media & Evidence</h1>
      </div>

      <div className="mt-4">
        {allEvidence.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allEvidence.map((i, index) => (
              <div key={index} className="space-y-1">
                <div className="relative group aspect-square">
                  <Image
                    src={i.url}
                    alt={i.filename || "evidence"}
                    fill
                    className="object-cover rounded-md border"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <a
                      href={i.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-xs underline"
                    >
                      View
                    </a>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 truncate w-24" title={i.filename}>
                  {i.type}: {i.filename || "file"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No evidence provided.</p>
        )}
      </div>
    </div>
  );
};

export default MediaEvidence;
