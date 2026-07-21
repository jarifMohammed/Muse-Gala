"use client";

import BookingDetailsSkeleton from "./booking-details-skeleton";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  _id?: string;
  firstName?: string;
  lastName?: string;
}

interface Booking {
  _id?: string;
  customer?: Customer;
}

interface DisputeDetails {
  _id?: string;
  status?: "Pending" | "Resolved" | "Rejected" | "Escalated" | string;
  booking?: Booking;
  createdAt?: string;
  escalationPriority?: string;
  escalatedAt?: string;
}

interface AboutDisputesProps {
  disputesDetails?: DisputeDetails | null;
  isLoading: boolean;
}

const AboutDisputes: React.FC<AboutDisputesProps> = ({
  disputesDetails,
  isLoading,
}) => {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  return (
    <div className="bg-white p-4 md:p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-medium font-medium">Dispute Summary</h1>
        <div>
          <span
            className={`px-2 rounded-3xl font-semibold text-xs py-1 ${disputesDetails?.status === "Pending"
              ? "text-orange-600 bg-orange-200"
              : disputesDetails?.status === "Resolved"
                ? "text-green-600 bg-green-200"
                : disputesDetails?.status === "Rejected"
                  ? "text-red-600 bg-red-200"
                  : disputesDetails?.status === "Escalated"
                    ? "text-white bg-[#54051d]"
                    : "text-gray-600 bg-gray-200"
              }`}
          >
            {disputesDetails?.status ?? "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between border-b pb-1 gap-4 items-center">
          <span className="text-gray-500 whitespace-nowrap">Dispute ID</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-right break-all">
              {disputesDetails?._id ?? "N/A"}
            </span>
            {disputesDetails?._id && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-[#54051d]"
                onClick={() => handleCopy(disputesDetails._id!, "Dispute ID")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between border-b pb-1 gap-4 items-center">
          <span className="text-gray-500 whitespace-nowrap">Booking ID</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-right break-all">
              {disputesDetails?.booking?._id ?? "N/A"}
            </span>
            {disputesDetails?.booking?._id && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-[#54051d]"
                onClick={() =>
                  handleCopy(disputesDetails.booking!._id!, "Booking ID")
                }
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Customer</span>
          <span className="font-medium">
            {disputesDetails?.booking?.customer?.firstName 
              ? `${disputesDetails.booking.customer.firstName} ${disputesDetails.booking.customer.lastName ? `${disputesDetails.booking.customer.lastName.charAt(0)}.` : ""}`.trim()
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-1">
          <span className="text-gray-500">Reported At</span>
          <span className="font-medium">
            {disputesDetails?.createdAt
              ? new Date(disputesDetails.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        {disputesDetails?.escalationPriority && (
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-500">Escalation Priority</span>
            <span className={`font-semibold ${disputesDetails.escalationPriority === "High" ? "text-red-600" :
              disputesDetails.escalationPriority === "Medium" ? "text-orange-600" : "text-blue-600"
              }`}>
              {disputesDetails.escalationPriority}
            </span>
          </div>
        )}
        {disputesDetails?.escalatedAt && (
          <div className="flex justify-between border-b pb-1">
            <span className="text-gray-500">Escalated At</span>
            <span className="font-medium">
              {new Date(disputesDetails.escalatedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutDisputes;
