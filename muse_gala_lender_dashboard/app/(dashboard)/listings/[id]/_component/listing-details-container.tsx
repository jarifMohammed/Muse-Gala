"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Listing } from "@/types/listings/index";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, MoveLeft, X } from "lucide-react";
import moment from "moment";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AvailabilityCalendar from "./availability-calendar";
const AlertModal = dynamic(() => import("@/components/ui/custom/alert-modal"), {
  ssr: false,
});

interface Props {
  listingId: string;
  token: string;
}

interface ApiProps {
  status: true;
  message: string;
  data: Listing;
}

const ListingDetailsContainer = ({ listingId, token }: Props) => {
  const [isRouteChanging, setIsRouteChangin] = useState(false);
  const [editAlertDialog, setEditAlertDialog] = useState(false);

  const router = useRouter();
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<ApiProps>({
      queryKey: ["listing", listingId],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/${listingId}`,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json()),
    });

  useEffect(() => {
    return () => {
      setIsRouteChangin(false);
    };
  }, []);

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Something went wrong!
          </h2>
          <p className="text-red-600 mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isApproved = data?.data.approvalStatus === "approved";
  const isRejected = data?.data.approvalStatus === "rejected";

  return (
    <div className="p-4 sm:p-8 bg-[#fefaf6] space-y-5 sm:space-y-8">
      <div className="mb-2 sm:mb-4">
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
      <h2 className="text-[16px] sm:text-[20px] font-normal uppercase tracking-wide">LISTINGS DETAILS</h2>

      {data?.data.approvalStatus === "rejected" && (
        <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-red-500 font-medium">
            <span className="font-bold underline mr-1">Rejection Reason:</span>
            {data?.data.reasonsForRejection}
          </AlertDescription>
        </Alert>
      )}

      <SkeletonWrapper isLoading={isLoading || isRefetching}>
        <Card className="grid grid-cols-1 lg:grid-cols-12 rounded-none border-none shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] bg-gray-50/50">
              <Image
                src={
                  data?.data.media[0] ??
                  "https://files.edgestore.dev/vkpagg64z2y0yvdx/publicFiles/_public/4420c9d1-dd2e-4afa-9b54-8a85d396ecbc.jpeg"
                }
                alt={data?.data.dressName ?? ""}
                fill
                className="object-cover rounded-none"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8 bg-white p-5 sm:p-8 xl:p-10 rounded-none flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-50">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {data?.data.brand} - {data?.data.dressName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">
                  Product ID: <span className="font-semibold text-gray-700">{data?.data.dressId}</span>
                </p>
              </div>
              <div className="w-full sm:w-auto shrink-0 flex justify-start sm:justify-end">
                {/* <Link href={`/listings/${data?.data._id}/edit`}> */}
                {!isApproved && !isRejected ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full sm:w-auto">
                        <Button disabled className="w-full sm:w-auto hover:bg-[#891d33] bg-[#891d33] text-white brightness-75">
                          Edit Details
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[200px]">
                        Your listing is under review and cannot be updated until
                        approval / Rejection
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div className="w-full sm:w-auto">
                    <Button
                      effect="ringHover"
                      className="w-full sm:w-auto bg-[#891d33] hover:bg-[#732032] text-white"
                      onClick={() => setEditAlertDialog((p) => !p)}
                    >
                      Edit Details
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-8">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900 min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Size</span>
                  <span className="font-medium text-gray-800">
                    {Array.isArray(data?.data.size)
                      ? data.data.size.join(", ")
                      : data?.data.size}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900 min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Color</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {Array.isArray(data?.data.colour) ? (
                      data.data.colour.join(", ")
                    ) : data?.data.colour ? (
                      data.data.colour
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900 min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Condition</span>
                  <span className="font-medium text-gray-800">{data?.data.condition}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900 min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Categories</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {Array.isArray(data?.data.category) ? (
                      data.data.category.join(", ")
                    ) : data?.data.category ? (
                      data.data.category
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900 min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Price</span>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-800">
                      <span className="text-[#891d33] font-bold">${data?.data.rentalPrice.fourDays}</span> / 4 Days
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="font-medium text-gray-800">
                      <span className="text-[#891d33] font-bold">${data?.data.rentalPrice.eightDays}</span> / 8 Days
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900 min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Platform Status</span>
                  <span
                    className={`inline-flex items-center w-fit gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold leading-tight ${isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {isApproved ? "Approved" : "Rejected"}
                    {isApproved ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold text-gray-900 min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Availability</span>
                  <span
                    className={`inline-flex items-center w-fit gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold leading-tight ${data?.data.isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {data?.data.isActive ? "Active" : "Inactive"}
                    {data?.data.isActive ? (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                    )}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm sm:text-base">
                  <span className="font-semibold min-w-[100px] uppercase tracking-wider text-[11px] sm:text-xs text-gray-400">Last Updated</span>
                  <span className="font-medium text-gray-600 text-[13px] sm:text-sm">
                    {moment(data?.data.updatedAt).format(
                      "DD MMM, YYYY [at] hh:mm A"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading || isRefetching}>
        <Card className="bg-white p-5 sm:p-8 xl:p-10 rounded-none border-none shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 border-b border-gray-50 pb-3 sm:pb-4">Description & Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-1.5">
              <h4 className="font-semibold uppercase tracking-wider text-[11px] sm:text-xs text-gray-400 mb-2">Description</h4>
              <p className="text-sm sm:text-base font-medium text-gray-800 leading-relaxed">
                {data?.data.description || <span className="text-gray-400 italic">No description provided.</span>}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold uppercase tracking-wider text-[11px] sm:text-xs text-gray-400 mb-2">Materials</h4>
              <p className="text-sm sm:text-base font-medium text-gray-800 leading-relaxed">
                {data?.data.material || <span className="text-gray-400 italic">Material information not available.</span>}
              </p>
            </div>
          </div>
        </Card>
      </SkeletonWrapper>

      {/* <div className="grid grid-cols-2 gap-5">
        <SkeletonWrapper isLoading={isLoading}>
          <Card className=" w-full">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-semibold text-gray-900 ">
                  Availability Calendar
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityCalendar
                year={2025}
                month={7} // August (0-based index)
                greenDates={[2, 12, 24, 16]}
                redDates={[4, 10]}
                yellowDates={[14, 15]}
              />
            </CardContent>
          </Card>
        </SkeletonWrapper>
      </div> */}

      <AlertModal
        loading={isRouteChanging}
        onConfirm={() => {
          setIsRouteChangin(true);
          router.push(`/listings/${data?.data._id}/edit`);
        }}
        onClose={() => setEditAlertDialog(false)}
        title="Edit Listing Confirmation"
        message="Editing this listing will require admin re-approval. Your changes may temporarily affect its visibility and impact your business performance. Do you want to continue?"
        isOpen={editAlertDialog}
      />
    </div>
  );
};

export default ListingDetailsContainer;
