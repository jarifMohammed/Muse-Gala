"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { FormEvent, useState } from "react";
import DateRange from "./date-range";
import DressName from "./dress-name";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ManualBookingPayload {
  listingId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalDurationDays: number;
  size: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ManualBookings = ({ isOpen, setIsOpen }: Props) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [rentalDurationDays, setRentalDurationDays] = useState<number>(0);
  const [selectedDressId, setSelectedDressId] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const queryClient = useQueryClient();

  const { data: listingInfo } = useQuery({
    queryKey: ["lender-all-listing"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }
        return res.json();
      }),
    enabled: !!token,
  });

  const { mutateAsync: manualBookingMutate, isPending } = useMutation({
    mutationKey: ["manual-booking"],
    mutationFn: async (payload: ManualBookingPayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/manual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create booking");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      resetForm();
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create booking");
    },
  });

  const handleManualBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedDressId) {
      toast.error("Please select a dress");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const payload: ManualBookingPayload = {
      listingId: selectedDressId,
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      rentalDurationDays: rentalDurationDays,
      size: selectedSize,
    };

    try {
      await manualBookingMutate(payload);
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setRentalDurationDays(0);
    setSelectedDressId("");
    setSelectedSize("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="w-[95%] md:max-w-[800px] p-4 md:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg md:text-xl">Manual Booking</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleManualBooking}>
          <DressName
            selectedDressId={selectedDressId}
            setSelectedDressId={setSelectedDressId}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            listingInfo={listingInfo}
          />
          <DateRange
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            rentalDurationDays={rentalDurationDays}
            setRentalDurationDays={setRentalDurationDays}
          />

          <div className="text-center mt-10">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating Booking" : "Manual Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualBookings;
