import React from "react";
import ShippingStatus from "./shipping-status";
import PickupStatus from "./pickup-status";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  bookingDetails: {
    deliveryMethod?: string;
    deliveryStatus?: string;
    paymentStatus?: string;
  };
  token: string;
  isLoading: boolean;
  lenderId: string;
}

const DeliveryStatus = ({ bookingDetails, token, isLoading, lenderId }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-full">
            <div className="flex items-center gap-4 md:gap-8">
              <Skeleton className="size-10 md:p-10 rounded-full shrink-0" />

              <Skeleton
                className={`h-2 w-full rounded-3xl ${index === 4 ? "hidden" : "block"
                  }`}
              />
            </div>

            <Skeleton className="h-4 w-3/4 my-3" />

            <Skeleton className="h-8 md:h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {bookingDetails?.deliveryMethod === "Shipping" ? (
        <ShippingStatus
          deliveryStatus={bookingDetails?.deliveryStatus}
          paymentStatus={bookingDetails?.paymentStatus}
          token={token}
          lenderId={lenderId}
        />
      ) : (
        <PickupStatus
          deliveryStatus={bookingDetails?.deliveryStatus}
          paymentStatus={bookingDetails?.paymentStatus}
          token={token}
          lenderId={lenderId}
        />
      )}
    </div>
  );
};

export default DeliveryStatus;
