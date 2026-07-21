"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AboutBooking from "./about-booking";
import type { BookingDetails as AboutBookingDetails } from "./about-booking";
import AboutPayment from "./about-payment";
import AboutReturn from "./about-return";
import DisputeForm from "./dispute-form";
import DeliveryStatus from "./delivery-status";
import Link from "next/link";
import BookingActions from "./booking-actions";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

interface Props {
  token: string;
  userID: string;
}

type BookingDetailsData = AboutBookingDetails & {
  paymentStatus?: string;
  payoutStatus?: string;
  deliveryMethod?: string;
  returnMethod?: string;
  returnNotes?: string;
  returnConfirmedAt?: string;
  returnTrackingNumber?: string;
  returnReceiptPhoto?: string;
  returnDroppedOffAt?: string;
  allocatedLender?: {
    lenderId?: string;
  };
};

const BookingsDetails = ({ token, userID }: Props) => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: bookingDetails, isLoading } = useQuery<BookingDetailsData>({
    queryKey: ["all-bookings", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/${id}`,
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
    enabled: Boolean(id),
  });

  return (
    <div>
      <div className="mb-4">
        <Button
          asChild
          className="p-0 h-auto hover:bg-transparent"
          effect="expandIcon"
          icon={MoveLeft}
          iconPlacement="left"
          variant="link"
        >
          <Link href="/bookings">Back to Bookings</Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <h1 className="uppercase text-xl md:text-2xl font-semibold">Booking Details</h1>
        <BookingActions
          bookingDetails={bookingDetails}
          token={token}
          userID={userID}
          isLoading={isLoading}
        />
      </div>

      <div className="mb-6 md:mb-10">
        <DeliveryStatus
          bookingDetails={bookingDetails}
          token={token}
          isLoading={isLoading}
          lenderId={bookingDetails?.allocatedLender?.lenderId || ""}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <AboutBooking bookingDetails={bookingDetails} isLoading={isLoading} />
        <AboutPayment bookingDetails={bookingDetails} isLoading={isLoading} />
        <AboutReturn bookingDetails={bookingDetails} isLoading={isLoading} />
      </div>

      <div className="mt-6 md:mt-10">
        <DisputeForm />
      </div>
    </div>
  );
};

export default BookingsDetails;
