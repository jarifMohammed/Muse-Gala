"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import BookingSummery from "./modals/booking-summery";
import { useModalStore } from "@/state/ModalState/useModalStore";
import BookingCustomer from "./modals/booking-customer";
import BookingLender from "./modals/booking-lender";
import BookingPayment from "./modals/booking-payment";
import BookingDisputes from "./modals/booking-disputes";
import BookingTimeline from "./modals/booking-timeline";
import { useQuery } from "@tanstack/react-query";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  id: string;
  token: string;
}

export interface Booking {
  _id: string;
  customer: Customer;
  allocatedLender: {
    lenderId: Lender;
  };
  masterdressId: string;
  dressName: string;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDurationDays: number;
  city: string;
  state: string;
  country: string;
  postcode: string;
  suburb: string;
  address: string;
  size: string;
  deliveryMethod: "Shipping" | "Pickup";
  lenderPrice: number;
  rentalFee: number;
  shippingFee: number;
  insuranceFee: number;
  totalAmount: number;
  deliveryStatus: "Pending" | "Shipped" | "Delivered" | "Returned" | "CancelledByCustomer";
  paymentStatus: "Pending" | "Paid" | "Failed";
  payoutStatus: "pending" | "paid" | "failed";
  tryOnRequested: boolean;
  tryOnAllowedByLender: boolean;
  tryOnOutcome: "ProceededWithRental" | "Cancelled";
  isManualBooking: boolean;
  customerNotes: string;
  lenderNotes: string;
  adminNotes: string;
  statusHistory: StatusHistory[];
  stripePaymentIntentId?: string;
  payouts?: Array<{
    bookingAmount: number;
    lenderPrice: number;
    adminsProfit: number;
    requestedAmount: number;
    commission: number;
    status: string;
    requestedAt: string;
    _id: string;
  }>;
  disputes?: Array<{
    _id: string;
    booking: string;
    createdBy: string;
    issueType: string;
    description: string;
    evidence: string[];
    status: string;
    timeline: Array<{
      actor: string;
      role: string;
      message: string;
      attachments: Array<{ filename: string; url: string }>;
      type: string;
      timestamp: string;
    }>;
    isEscalated: boolean;
    escalationConfirmed: boolean;
    escalationScheduleCall: boolean;
    policyFlags: string[];
    refundProcessed: boolean;
    escalationEvidence: Array<{ filename: string; url: string }>;
    createdAt: string;
    updatedAt: string;
    escalatedAt?: string;
    escalationDescription?: string;
    escalationPriority?: string;
    escalationReason?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Lender {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface StatusHistory {
  _id: string;
  status: string;
  timestamp: string;
  updatedBy: string;
  reason?: string;
}

const BookingsModal = ({ isOpen, setIsOpen, id }: Props) => {
  const { isBookingModalOpen, setIsBookingModalOpen } = useModalStore();

  const levels = [
    { label: "Summary" },
    { label: "Customer" },
    { label: "Lender" },
    { label: "Payment" },
    { label: "Disputes" },
    // { label: "Notes" },
    { label: "Timeline" },
  ];

  const { data: bookingDetails } = useQuery<Booking>({
    queryKey: ["bookings-details", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/overview/dashboard/bookings/${id}`
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!id,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-5xl p-10 max-h-[90vh] flex flex-col">
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <Image
              src={"/logo.png"}
              alt="logo.png"
              width={1000}
              height={1000}
              className="w-12 h-12 mx-auto"
            />
          </div>

          <h1 className="text-xl font-medium">Booking Details</h1>

          <div className="flex items-center justify-between mt-8 border-b border-black/25">
            {levels.map((item, index) => (
              <button
                onClick={() => setIsBookingModalOpen(item.label)}
                className={`pb-1 px-5 ${isBookingModalOpen === item.label
                  ? "border-b-2 border-black"
                  : ""
                  }`}
                key={index}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div>
            {!bookingDetails ? (
              <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                {isBookingModalOpen === "Summary" && (
                  <BookingSummery bookingDetails={bookingDetails as Booking} />
                )}
                {isBookingModalOpen === "Customer" && (
                  <BookingCustomer bookingDetails={bookingDetails as Booking} />
                )}
                {isBookingModalOpen === "Lender" && (
                  <BookingLender bookingDetails={bookingDetails as Booking} />
                )}
                {isBookingModalOpen === "Payment" && (
                  <BookingPayment bookingDetails={bookingDetails as Booking} />
                )}
                {isBookingModalOpen === "Disputes" && (
                  <BookingDisputes bookingDetails={bookingDetails as Booking} />
                )}
                {/* {isBookingModalOpen === "Notes" && <BookingNotes />} */}
                {isBookingModalOpen === "Timeline" && (
                  <BookingTimeline statusHistory={bookingDetails?.statusHistory || []} />
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingsModal;
