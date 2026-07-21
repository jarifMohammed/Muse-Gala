"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LucideIcon, XCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  deliveryStatus: string;
  statusValue: string;
  IconName: React.ElementType;
  btnName: string;
  token: string;
  bookingId: string;
  isCompleted?: boolean;
  isDisabled?: boolean;
  negativeStatusValue?: string;
  negativeBtnName?: string;
  completedBtnName?: string;
  isNextCompleted?: boolean;
  isLastStep?: boolean;
}

const UpdateStatus = ({
  deliveryStatus,
  statusValue,
  IconName: StandardIcon,
  btnName,
  token,
  bookingId,
  isCompleted,
  isDisabled,
  negativeStatusValue,
  negativeBtnName,
  completedBtnName,
  isNextCompleted,
  isLastStep,
}: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Shipping states
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");

  // Pickup states
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  const isFailed = negativeStatusValue && deliveryStatus === negativeStatusValue;
  const effectiveIsCompleted = isCompleted || isFailed;

  const { mutateAsync, isPending } = useMutation<
    any,
    any,
    {
      deliveryStatus?: string;
      trackingNumber?: string;
      shippingMethod?: string;
      pickupLocation?: string;
      pickupDate?: string;
      pickupTime?: string;
    } | undefined
  >({
    mutationKey: ["status"],
    mutationFn: async (payload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            deliveryStatus: payload?.deliveryStatus || statusValue,
            ...payload,
          }),
        }
      );
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      toast.success(data?.message || "Status updated successfully");
      setIsOpen(false);
      setIsPickupOpen(false);
      setIsConfirmOpen(false);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update status");
    },
  });

  const handleConfirm = async () => {
    if (statusValue === "ShippedToCustomer") {
      setIsOpen(true);
      return;
    }

    if (statusValue === "ReadyForPickup") {
      setIsPickupOpen(true);
      return;
    }

    // For all other statuses, show a confirmation modal first
    setIsConfirmOpen(true);
  };

  const executeStatusUpdate = async () => {
    try {
      await mutateAsync(undefined);
    } catch (error) {
      console.log(`error ${error}`);
    }
  };

  const handleNegativeConfirm = async () => {
    try {
      await mutateAsync({ deliveryStatus: negativeStatusValue });
    } catch (error) {
      console.log(`error ${error}`);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber || !shippingMethod) {
      toast.error("Please fill in all shipping details");
      return;
    }

    try {
      await mutateAsync({ trackingNumber, shippingMethod });
    } catch (error) {
      console.log(`error ${error}`);
    }
  };

  const handlePickupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !pickupDate || !pickupTime) {
      toast.error("Please fill in all pickup details");
      return;
    }

    try {
      // Combine date and time into ISO 8601 format
      // pickupDate is "YYYY-MM-DD", pickupTime is "HH:mm"
      const isoDateTime = new Date(`${pickupDate}T${pickupTime}:00Z`).toISOString();
      await mutateAsync({ pickupLocation, pickupDate, pickupTime: isoDateTime });
    } catch (error) {
      console.log(`error ${error}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center group">
      {/* Icon row with connecting line */}
      <div className="relative flex justify-center items-center w-full mb-3">
        {/* Progress Line extending right from center of icon */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-[2px] transition-colors duration-500 ${isNextCompleted ? (isFailed ? "bg-red-400" : "bg-primary") : "bg-neutral-200"
            } ${isLastStep ? "hidden" : "block"}`}
          style={{ left: "50%", right: "-50%", zIndex: 0 }}
        />



        {/* Icon Circle - always centered */}
        <div
          className={`h-14 w-14 rounded-full flex items-center justify-center z-10 transition-all duration-300 border-2 shadow-sm flex-shrink-0 ${effectiveIsCompleted
            ? isFailed
              ? "bg-red-500 border-red-500 text-white scale-110 shadow-red-200"
              : "bg-primary border-primary text-white scale-110 shadow-primary/20"
            : "bg-white border-neutral-200 text-neutral-400"
            }`}
        >
          {isFailed ? (
            <XCircle className="h-6 w-6 transition-transform duration-300 scale-110" />
          ) : (
            <StandardIcon
              className={`h-6 w-6 transition-transform duration-300 ${effectiveIsCompleted ? "scale-110" : ""
                }`}
            />
          )}
        </div>
      </div>

      {/* Action Buttons - centered below icon */}
      <div className="flex flex-col gap-2 items-center">
        <Button
          onClick={handleConfirm}
          variant={effectiveIsCompleted ? "secondary" : isDisabled ? "outline" : "default"}
          disabled={isDisabled || effectiveIsCompleted || isPending}
          className={`min-w-24 w-fit px-2 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg transition-all duration-300 ${effectiveIsCompleted
            ? "bg-neutral-50 text-neutral-400 border-neutral-100 opacity-60 cursor-default"
            : isDisabled
              ? "border-neutral-200 text-neutral-300 bg-neutral-50/50"
              : "shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 text-white"
            }`}
        >
          {isPending ? (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
            </div>
          ) : effectiveIsCompleted ? (
            isFailed ? (
              "Failed"
            ) : (
              completedBtnName || "Confirmed"
            )
          ) : (
            btnName
          )}
        </Button>

        {negativeBtnName && !effectiveIsCompleted && !isDisabled && (
          <Button
            onClick={handleNegativeConfirm}
            variant="outline"
            disabled={isPending}
            className="min-w-24 w-fit px-2 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg transition-all duration-300 border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-red-500 hover:border-red-100 shadow-sm active:scale-95"
          >
            {negativeBtnName}
          </Button>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] p-8">
          <DialogHeader className="items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <StandardIcon className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">Confirm Status Update</DialogTitle>
            <p className="text-sm text-neutral-500">
              {statusValue === "Return Due" ? (
                "Clicking this will change the status to Return Due and automatically email the return link to the customer."
              ) : (
                <>
                  Are you sure you want to mark this booking as <span className="font-semibold text-neutral-900 capitalize">"{btnName}"</span>? This action will progress the timeline.
                </>
              )}
            </p>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="flex-1 rounded-none border-neutral-200 h-12 uppercase tracking-widest text-[10px] font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={executeStatusUpdate}
              disabled={isPending}
              className="flex-1 rounded-none h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20"
            >
              {isPending ? "Updating..." : "Yes, Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shipping Details Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Shipping Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleShippingSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="courier">Courier</Label>
              <Select onValueChange={setShippingMethod} value={shippingMethod}>
                <SelectTrigger id="courier">
                  <SelectValue placeholder="Select a courier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AusPost">AusPost</SelectItem>
                  <SelectItem value="StarTrack">StarTrack</SelectItem>
                  <SelectItem value="Sendle">Sendle</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number/Tracking Link</Label>
              <Input
                id="tracking"
                placeholder="Enter tracking number/tracking link"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending} className="rounded-none w-full h-12 uppercase tracking-widest text-[10px] font-bold">
                {isPending ? "Submitting..." : "Confirm Shipping"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ready for Pickup Dialog */}
      <Dialog open={isPickupOpen} onOpenChange={setIsPickupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pickup Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePickupSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location</Label>
              <Input
                id="location"
                placeholder="Enter pickup address"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Pickup Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="block w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Pickup Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="block w-full"
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending} className="w-full rounded-none h-12 uppercase tracking-widest text-[10px] font-bold">
                {isPending ? "Submitting..." : "Confirm Ready Details"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

};

export default UpdateStatus;
