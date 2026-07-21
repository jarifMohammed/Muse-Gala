"use client";

import { BookingsResponse } from "@/types/bookings/bookingTypes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import AboutBooking from "./about-booking";
import AboutOrder from "./about-order";
import AboutPayment from "./about-payment";
import AboutAnalytics from "./about-analytics";
import DisputeForm from "./dispute-form";

interface Props {
  token: string;
}

const BookingsDetails = ({ token }: Props) => {
  const params = useParams();
  const id = params.id;

  const { data: bookingDetails = {}, isLoading } = useQuery<BookingsResponse>({
    queryKey: ["all-bookings"],
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
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-8">
        <AboutBooking bookingDetails={bookingDetails} isLoading={isLoading} />
        <AboutOrder bookingDetails={bookingDetails} isLoading={isLoading} />
        <AboutPayment bookingDetails={bookingDetails} isLoading={isLoading} />
        <AboutAnalytics bookingDetails={bookingDetails} isLoading={isLoading} />
      </div>

      <div>
        <DisputeForm />
      </div>
    </div>
  );
};

export default BookingsDetails;
