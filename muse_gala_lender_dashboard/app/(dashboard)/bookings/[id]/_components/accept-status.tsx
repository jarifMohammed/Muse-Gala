"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Handshake, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Props {
    token: string;
    bookingId: string;
    lenderId: string;
    deliveryStatus: string;
    paymentStatus?: string;
    isNextCompleted?: boolean;
}

const AcceptStatus = ({ token, bookingId, lenderId, deliveryStatus, paymentStatus, isNextCompleted }: Props) => {
    const queryClient = useQueryClient();
    const [isAcceptConfirmOpen, setIsAcceptConfirmOpen] = useState(false);
    const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

    const isPaymentFailed = paymentStatus === "Failed" || paymentStatus === "RetryPending";
    const isCompleted = deliveryStatus !== "Pending" && !isPaymentFailed;
    const isRejected = deliveryStatus.includes("Rejected");
    const isAccepted = isCompleted && !isRejected;

    const { mutateAsync: handleAction, isPending } = useMutation({
        mutationKey: ["accept-reject"],
        mutationFn: async (action: "accept" | "reject") => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/bookings/accept-reject`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `bearer ${token}`,
                    },
                    body: JSON.stringify({ bookingId, lenderId, action }),
                }
            );
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Something went wrong");
            }
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
            toast.success(data?.message || "Operation successful");
            setIsAcceptConfirmOpen(false);
            setIsRejectConfirmOpen(false);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong");
        },
    });

    const IconName = isRejected || isPaymentFailed ? X : isAccepted ? Check : Handshake;

    return (
        <div className="flex flex-col items-center group">
            {/* Icon row with connecting line */}
            <div className="relative flex justify-center items-center w-full mb-3">
                {/* Progress Line extending right from center of icon */}
                <div
                    className={`absolute top-1/2 -translate-y-1/2 h-[2px] transition-colors duration-500 ${isNextCompleted ? "bg-primary" : "bg-neutral-200"
                        }`}
                    style={{ left: "50%", right: "-50%", zIndex: 0 }}
                />

                {/* Icon Circle - always centered */}
                <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center z-10 transition-all duration-300 border-2 shadow-sm flex-shrink-0 ${isCompleted || isPaymentFailed
                        ? isRejected || isPaymentFailed
                            ? "bg-red-500 border-red-500 text-white scale-110 shadow-red-200"
                            : "bg-primary border-primary text-white scale-110 shadow-primary/20"
                        : "bg-white border-neutral-200 text-neutral-400"
                        }`}
                >
                    <IconName
                        className={`h-6 w-6 transition-transform duration-300 ${(isCompleted || isPaymentFailed) ? "scale-110" : ""}`}
                    />
                </div>
            </div>

            <div className="flex gap-2">
                {isPaymentFailed ? (
                    <Button
                        onClick={() => handleAction("accept")}
                        disabled={isPending}
                        className={`w-28 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 shadow-sm text-red-600 transition-all duration-300`}
                    >
                        {isPending ? "..." : "Retry Payment"}
                    </Button>
                ) : !isCompleted ? (
                    <>
                        <Button
                            onClick={() => setIsAcceptConfirmOpen(true)}
                            disabled={isPending}
                            className="w-20 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 text-white"
                        >
                            {isPending ? "..." : "Accept"}
                        </Button>
                        <Button
                            onClick={() => setIsRejectConfirmOpen(true)}
                            disabled={isPending}
                            variant="outline"
                            className="w-20 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg transition-all duration-300 border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-red-500 hover:border-red-100"
                        >
                            Reject
                        </Button>
                    </>
                ) : (
                    <Button
                        disabled
                        className={`w-24 text-[9px] font-semibold uppercase tracking-wider py-1 h-8 rounded-lg bg-neutral-50 border-neutral-100 opacity-60 cursor-default ${isRejected ? "text-red-500" : "text-neutral-400"
                            }`}
                    >
                        {isRejected ? "Rejected" : "Approved"}
                    </Button>
                )}
            </div>

            {/* Accept Confirmation */}
            <Dialog open={isAcceptConfirmOpen} onOpenChange={setIsAcceptConfirmOpen}>
                <DialogContent className="sm:max-w-[425px] p-8">
                    <DialogHeader className="items-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="h-8 w-8 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-bold">Accept Booking?</DialogTitle>
                        <p className="text-sm text-neutral-500">
                            Are you sure you want to <span className="font-semibold text-neutral-900">Accept</span> this booking? This will notify the customer and move the process forward.
                        </p>
                    </DialogHeader>
                    <DialogFooter className="flex-row gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsAcceptConfirmOpen(false)}
                            className="flex-1 rounded-none border-neutral-200 h-12 uppercase tracking-widest text-[10px] font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleAction("accept")}
                            disabled={isPending}
                            className="flex-1 rounded-none h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20 text-white"
                        >
                            {isPending ? "Accepting..." : "Yes, Accept"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Confirmation */}
            <Dialog open={isRejectConfirmOpen} onOpenChange={setIsRejectConfirmOpen}>
                <DialogContent className="sm:max-w-[425px] p-8">
                    <DialogHeader className="items-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                            <X className="h-8 w-8 text-red-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-red-600">Reject Booking?</DialogTitle>
                        <p className="text-sm text-neutral-500">
                            Are you sure you want to <span className="font-semibold text-red-600">Reject</span> this booking? This action cannot be undone.
                        </p>
                    </DialogHeader>
                    <DialogFooter className="flex-row gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectConfirmOpen(false)}
                            className="flex-1 rounded-none border-neutral-200 h-12 uppercase tracking-widest text-[10px] font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleAction("reject")}
                            disabled={isPending}
                            className="flex-1 rounded-none bg-red-600 hover:bg-red-700 h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-red-200 text-white"
                        >
                            {isPending ? "Rejecting..." : "Yes, Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AcceptStatus;
