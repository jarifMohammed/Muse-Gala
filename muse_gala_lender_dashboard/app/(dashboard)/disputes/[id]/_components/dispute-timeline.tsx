"use client";

import React from "react";
import BookingDetailsSkeleton from "./booking-details-skeleton";

import Image from "next/image";

type Attachment = {
  filename: string;
  url: string;
};

type TimelineEvent = {
  actor: string;
  role: string;
  message: string;
  type: string;
  timestamp: string;
  attachments?: Attachment[];
};

type DisputesDetails = {
  timeline?: TimelineEvent[];
};

type AboutBookingProps = {
  disputesDetails?: DisputesDetails;
  isLoading?: boolean;
};

const DisputeTimeline: React.FC<AboutBookingProps> = ({
  disputesDetails,
  isLoading,
}) => {
  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  const timeline = disputesDetails?.timeline ?? [];

  return (
    <div className="bg-white p-4 md:p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div>
        <h1 className="text-lg md:text-xl font-medium">Dispute History</h1>
      </div>

      <div className="mt-6 relative">
        {timeline.length > 0 ? (
          <div className="space-y-6">
            {timeline.map((i, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Vertical Line Connector */}
                {index !== timeline.length - 1 && (
                  <div className="absolute left-[11px] top-6 w-[2px] h-[calc(100%+24px)] bg-gray-100" />
                )}

                {/* Role Dot */}
                <div className={`h-6 w-6 rounded-full flex-shrink-0 z-10 flex items-center justify-center text-[10px] font-bold text-white ${i.role === "LENDER" ? "bg-primary" :
                  i.role === "CUSTOMER" ? "bg-blue-600" : "bg-purple-600"
                  }`}>
                  {i.role[0]}
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {i.role} • {i.type}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(i.timestamp).toLocaleString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{i.message}</p>

                  {i.attachments && i.attachments.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {i.attachments.map((img, idx) => (
                        <div key={idx} className="relative group flex-shrink-0">
                          <Image
                            src={img.url}
                            alt={img.filename}
                            width={100}
                            height={100}
                            className="h-14 w-14 object-cover rounded border"
                          />
                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded text-[10px] text-white"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-6 text-gray-500 underline decoration-dotted">No history found</p>
        )}
      </div>
    </div>
  );
};

export default DisputeTimeline;
