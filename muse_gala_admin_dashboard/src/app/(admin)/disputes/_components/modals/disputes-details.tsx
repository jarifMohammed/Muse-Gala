/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";

interface DisputesDetailsProps {
  disputesDetails: any;
  isLoading: boolean;
}

const DisputesDetails = ({
  disputesDetails,
  isLoading,
}: DisputesDetailsProps) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastCommunicationTime = () => {
    if (!disputesDetails?.timeline || disputesDetails.timeline.length === 0) {
      return disputesDetails?.createdAt || "N/A";
    }
    const lastEvent =
      disputesDetails.timeline[disputesDetails.timeline.length - 1];
    return lastEvent.timestamp;
  };

  // Skeleton components
  const DetailsSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-52" />
    </div>
  );

  const EvidenceSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );

  const ButtonSkeleton = () => (
    <div className="flex items-center gap-5 flex-wrap">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-9 w-36" />
      <Skeleton className="h-9 w-28" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="mt-5">
        <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
          <DetailsSkeleton />
        </div>

        <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-6">
          <EvidenceSkeleton />
        </div>

        <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-10">
          <Skeleton className="h-6 w-24 mb-4" />
          <ButtonSkeleton />
        </div>
      </div>
    );
  }

  const evidence = disputesDetails?.evidence || [];
  const timeline = disputesDetails?.timeline || [];
  const lastCommunication = getLastCommunicationTime();

  return (
    <div className="mt-5">
      {/* Dispute Information */}
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <div className="text-sm space-y-3">
          <div>
            <span className="font-medium">Issue Type: </span>
            <span className="text-gray-600">
              {disputesDetails?.issueType || "N/A"}
              {disputesDetails?.issueType && " (Locked)"}
            </span>
          </div>

          <div>
            <span className="font-medium">Description: </span>
            <span className="text-gray-600">
              {disputesDetails?.description || "No description provided"}
            </span>
          </div>

          {disputesDetails?.escalationReason && (
            <div>
              <span className="font-medium">Escalation Reason: </span>
              <span className="text-gray-600">
                {disputesDetails.escalationReason}
              </span>
            </div>
          )}

          {disputesDetails?.escalationPriority && (
            <div>
              <span className="font-medium">Escalation Priority: </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${disputesDetails.escalationPriority === "High"
                  ? "bg-red-100 text-red-800"
                  : disputesDetails.escalationPriority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                  }`}
              >
                {disputesDetails.escalationPriority}
              </span>
            </div>
          )}

          <div>
            <span className="font-medium">Submission: </span>
            <span className="text-gray-600">
              {disputesDetails?.createdAt
                ? formatDateTime(disputesDetails.createdAt)
                : "N/A"}
            </span>
          </div>

          <div>
            <span className="font-medium">Last Communication: </span>
            <span className="text-gray-600">
              {lastCommunication ? formatDateTime(lastCommunication) : "N/A"}
            </span>
          </div>

          <div>
            <span className="font-medium">Status: </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${disputesDetails?.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : disputesDetails?.status === "Escalated"
                  ? "bg-orange-100 text-orange-800"
                  : disputesDetails?.status === "Resolved"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              {disputesDetails?.status || "N/A"}
            </span>
          </div>

          {disputesDetails?.isEscalated && (
            <div>
              <span className="font-medium">Escalated At: </span>
              <span className="text-gray-600">
                {disputesDetails?.escalatedAt
                  ? formatDateTime(disputesDetails.escalatedAt)
                  : "N/A"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Evidence */}
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-4">Uploaded Evidence</h3>

        {evidence.length === 0 ? (
          <p className="text-gray-500 text-sm">No evidence uploaded</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evidence.map((file: any, index: number) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-2">
                  {file.url.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (
                    <Image
                      src={file.url}
                      alt={file.filename}
                      width={200}
                      height={150}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <div className="text-sm font-medium">Document</div>
                      <div className="text-xs mt-1">{file.filename}</div>
                    </div>
                  )}
                </div>
                <p
                  className="text-xs text-gray-600 truncate"
                  title={file.filename}
                >
                  {file.filename}
                </p>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                >
                  View Full Size
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-4">Timeline</h3>

        {timeline.length === 0 ? (
          <p className="text-gray-500 text-sm">No timeline events yet</p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

            <div className="space-y-4">
              {timeline.map((event: any, index: number) => {
                const actor = event.role || event.actor || "Unknown";
                const action = event.action || "";
                const message = event.message || event.description || event.note || "";
                const dotColor =
                  actor === "admin"
                    ? "bg-blue-500"
                    : actor === "renter"
                      ? "bg-green-500"
                      : actor === "lender"
                        ? "bg-orange-500"
                        : actor === "system"
                          ? "bg-purple-500"
                          : "bg-gray-400";

                return (
                  <div key={index} className="flex items-start space-x-3 text-sm relative">
                    <div className={`w-3.5 h-3.5 ${dotColor} rounded-full mt-0.5 flex-shrink-0 z-10 ring-2 ring-white`}></div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold capitalize">{actor}</span>
                          {action && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                              {action}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 text-xs">
                          {event.timestamp ? formatDateTime(event.timestamp) : "N/A"}
                        </span>
                      </div>
                      {message && (
                        <p className="text-gray-600 mt-1">{message}</p>
                      )}
                      {event.attachments && event.attachments.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Attachments:{" "}
                          </span>
                          {event.attachments.map((att: any, attIndex: number) => (
                            <a
                              key={attIndex}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                            >
                              {att.filename}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputesDetails;
