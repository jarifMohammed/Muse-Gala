/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface BookingSnapShotProps {
  disputesDetails: any;
  isLoading: boolean;
}

interface AIAnalysisResponse {
  success: boolean;
  recommendation: {
    verdict: string;
    applicable_policy: string;
    reasoning: string;
    suggested_action: string;
    admin_internal_note: string;
  };
}

const BookingSnapShot = ({
  disputesDetails,
  isLoading,
}: BookingSnapShotProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const disputeId = disputesDetails?._id;

  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const {
    data: aiAnalysis,
    isLoading: isAnalysisLoading,
    error,
    refetch,
  } = useQuery<AIAnalysisResponse>({
    queryKey: ["ai-analysis", disputeId],
    queryFn: async () => {
      if (!disputeId) {
        throw new Error("No dispute ID found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/${disputeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch AI analysis");
      }

      return response.json();
    },
    enabled: false, // Don't fetch automatically, only on button click
    retry: 1,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSeeAIAnalysis = () => {
    if (disputeId) {
      refetch().then(() => {
        setIsModalOpen(true);
      });
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict?.toLowerCase()) {
      case "escalated":
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      case "resolved":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "rejected":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict?.toLowerCase()) {
      case "escalated":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "resolved":
        return "text-green-700 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  // Skeleton components
  const InfoSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-52" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-60" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-36" />
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

  const AnalysisSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-40 mt-4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-8 w-36 mt-4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );

  if (isLoading) {
    return (
      <div className="mt-5">
        <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
          <InfoSkeleton />
        </div>

        <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-10">
          <Skeleton className="h-6 w-24 mb-4" />
          <ButtonSkeleton />
        </div>
      </div>
    );
  }

  const booking = disputesDetails?.booking;
  const customer = booking?.customer;
  const lender = booking?.lender;

  return (
    <div className="space-y-8">
      <div>
        <Button
          onClick={handleSeeAIAnalysis}
          disabled={isAnalysisLoading || !disputeId}
        >
          {isAnalysisLoading ? "Analyzing..." : "See AI Analysis"}
        </Button>
      </div>

      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <div className="text-sm space-y-2">
          <h3 className="font-medium">
            Booking ID:{" "}
            <span className="font-normal text-gray-600">
              {booking?._id ? `#${booking._id}` : "N/A"}
            </span>
          </h3>
          <h3 className="font-medium">
            Dress Name:{" "}
            <span className="font-normal text-gray-600">
              {booking?.listing?.title || "Floral Maxi Dress"}
            </span>
          </h3>
          <h3 className="font-medium">
            Dates:{" "}
            <span className="font-normal text-gray-600">
              {disputesDetails?.createdAt
                ? formatDate(disputesDetails.createdAt)
                : "2025-04-20 to 2025-04-22"}
            </span>
          </h3>
          <h3 className="font-medium">
            Size:{" "}
            <span className="font-normal text-gray-600">
              {booking?.listing?.size || "M"}
            </span>
          </h3>
          <h3 className="font-medium">
            Customer:{" "}
            <span className="font-normal text-gray-600">
              {customer
                ? `${customer.firstName} ${customer.lastName}`
                : "Jane Doe"}
              {customer?.email && ` (${customer.email})`}
              {customer?.phone && `, ${customer.phone}`}
            </span>
          </h3>
          <h3 className="font-medium">
            Lender:{" "}
            <span className="font-normal text-gray-600">
              {lender ? `${lender.firstName} ${lender.lastName}` : "Sophie K."}
              {lender?.email && ` (${lender.email})`}
              {lender?.phone && `, ${lender.phone}`}
            </span>
          </h3>
          <h3 className="font-medium">
            Delivery Method:{" "}
            <span className="font-normal text-gray-600">
              {booking?.deliveryMethod || "Pickup"}
            </span>
          </h3>
          <h3 className="font-medium">
            Insurance Status:{" "}
            <span className="font-normal text-gray-600">
              {booking?.insurance ? "Yes" : "No"}
            </span>
          </h3>
          <h3 className="font-medium">
            Issue Type:{" "}
            <span className="font-normal text-gray-600">
              {disputesDetails?.issueType || "N/A"}
            </span>
          </h3>
          <h3 className="font-medium">
            Dispute Status:{" "}
            <span className="font-normal text-gray-600">
              {disputesDetails?.status || "N/A"}
            </span>
          </h3>
          <h3 className="font-medium">
            Created:{" "}
            <span className="font-normal text-gray-600">
              {disputesDetails?.createdAt
                ? formatDate(disputesDetails.createdAt)
                : "N/A"}
            </span>
          </h3>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Analysis Results</DialogTitle>
            <DialogDescription>
              Analysis for Dispute ID: {disputeId}
            </DialogDescription>
          </DialogHeader>

          {isAnalysisLoading ? (
            <div className="py-6">
              <AnalysisSkeleton />
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analysis Failed
              </h3>
              <p className="text-gray-600 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to fetch AI analysis"}
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-6 py-4">
              {/* Verdict Section */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">AI Recommendation</h3>
                  <p className="text-sm text-gray-600">
                    Based on policy analysis and dispute details
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getVerdictColor(
                    aiAnalysis?.recommendation?.verdict
                  )}`}
                >
                  {getVerdictIcon(aiAnalysis?.recommendation?.verdict)}
                  <span className="font-semibold">
                    {aiAnalysis?.recommendation?.verdict}
                  </span>
                </div>
              </div>

              {/* Applicable Policy */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Applicable Policy
                </h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <code className="text-sm text-gray-800">
                    {aiAnalysis?.recommendation?.applicable_policy || "N/A"}
                  </code>
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Reasoning</h4>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <p className="text-gray-700 whitespace-pre-line">
                    {aiAnalysis?.recommendation?.reasoning || "N/A"}
                  </p>
                </div>
              </div>

              {/* Suggested Action */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Suggested Action
                </h4>
                <div className="bg-green-50 p-4 rounded-md border border-green-100">
                  <p className="text-gray-700">
                    {aiAnalysis?.recommendation?.suggested_action || "N/A"}
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Internal Notes
                </h4>
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                  <p className="text-gray-700">
                    {aiAnalysis?.recommendation?.admin_internal_note || "N/A"}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Analysis completed successfully
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </Button>
                    <Button onClick={() => window.print()} variant="outline">
                      Print Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-gray-600">No analysis data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingSnapShot;
