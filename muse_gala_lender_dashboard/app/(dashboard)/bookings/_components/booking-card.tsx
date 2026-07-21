"use client";

import React from "react";
import { Booking } from "@/types/bookings/bookingTypes";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import AcceptRejectButton from "./accept-reject-button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MessageCustomerButton from "@/components/message-customer-button";

interface BookingCardProps {
    item: Booking;
    token: string;
}

const BookingCard = ({ item, token }: BookingCardProps) => {
    const formatStatus = (status?: string) => {
        if (!status) return "Pending";
        return status.replace(/([A-Z])/g, " $1").trim();
    };

    const handleCopy = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${type} copied to clipboard`);
    };

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case "Pending":
                return "text-orange-600 bg-orange-100";
            case "ShippedToCustomer":
                return "text-blue-600 bg-blue-100";
            case "Paid":
                return "text-green-600 bg-green-100";
            case "AcceptedByLender":
            case "Accepted by Lender":
                return "text-green-600 bg-green-100";
            default:
                if (status.includes("Rejected")) {
                    return "text-red-600 bg-red-100";
                }
                return "text-gray-600 bg-gray-100";
        }
    };

    const isPending = item.deliveryStatus === "Pending";

    const formatAddress = (address: Booking["shippingAddress"] | Booking["pickupLocation"]) => {
        if (!address) return "N/A";
        if (typeof address === "string") return address;
        const { street, city, state, postcode, address: fullAddress } = address;
        return fullAddress || [street, city, state, postcode].filter(Boolean).join(", ") || "N/A";
    };
    const displayAddress = formatAddress(item.shippingAddress || item.pickupLocation) !== "N/A"
        ? formatAddress(item.shippingAddress || item.pickupLocation)
        : [
            (item as any).address,
            (item as any).suburb,
            (item as any).city,
            (item as any).state,
            (item as any).postcode,
            (item as any).country
        ].filter(Boolean).join(", ") || "N/A";
    return (
        <div className="bg-white p-4 rounded-xl shadow-[0px_2px_8px_0px_#00000010] space-y-3 border border-gray-100">
            {/* Header: Customer Name, Order ID & View Button */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Customer Name</p>
                        <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-sm break-all">
                                {item?.customer?.firstName ? (
                                    `${item.customer.firstName} ${item.customer.lastName ? `${item.customer.lastName.charAt(0)}.` : ""}`.trim()
                                ) : (
                                    item?.customer?.email || "N/A"
                                )}
                            </p>
                            <button
                                onClick={() => {
                                    const nameToCopy = item?.customer?.firstName ? `${item.customer.firstName} ${item.customer.lastName ? `${item.customer.lastName.charAt(0)}.` : ""}`.trim() : item?.customer?.email || "N/A";
                                    handleCopy(nameToCopy, "Customer Name");
                                }}
                                className="text-gray-400 hover:text-gray-600 active:scale-95 transition-all outline-none"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Order ID</p>
                        <div className="flex items-center gap-1.5">
                            <p className="font-medium text-xs break-all text-gray-600">{item._id.toUpperCase()}</p>
                            <button
                                onClick={() => handleCopy(item._id.toUpperCase(), "Order ID")}
                                className="text-gray-400 hover:text-gray-600 active:scale-95 transition-all outline-none"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-neutral-500 hover:text-primary hover:bg-primary/5 shrink-0"
                    asChild
                >
                    <Link href={`/bookings/${item._id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            {/* Dress Details: Name, Brand, Size, Color */}
            <div className="space-y-2">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Dress Name</p>
                    <p className="text-sm font-medium line-clamp-1 break-all">{item.dressName}</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Brand</p>
                        <p className="text-xs font-medium truncate capitalize">{item.brand || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Size</p>
                        <p className="text-xs font-medium truncate">{item.size || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Color</p>
                        <p className="text-xs font-medium truncate capitalize">{item.color || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Method</p>
                        <p className="text-xs font-medium truncate capitalize">{item.deliveryMethod || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Rental Period & Address */}
            <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Rental Period</p>
                        <p className="text-xs font-medium">
                            {new Date(item.rentalStartDate).toLocaleDateString()} - {new Date(item.rentalEndDate).toLocaleDateString()}
                        </p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">({item.rentalDurationDays} days)</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Address</p>
                    <p className="text-xs font-medium line-clamp-1 text-gray-600">{displayAddress}</p>
                </div>
            </div>

            {/* Status & Actions */}
            <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Payment</p>
                    <span
                        className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium w-fit",
                            item.paymentStatus === "Paid" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
                        )}
                    >
                        {item.paymentStatus}
                    </span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Status</p>
                    <span
                        className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium w-fit",
                            getStatusBadgeStyle(item.deliveryStatus)
                        )}
                    >
                        {formatStatus(item.deliveryStatus)}
                    </span>
                </div>
            </div>

            {isPending && (
                <div className="pt-1 w-full">
                    <AcceptRejectButton
                        token={token}
                        bookingId={item._id}
                        lenderId={item.allocatedLender?.lenderId}
                    />
                </div>
            )}

            <MessageCustomerButton
                bookingId={item._id}
                accessToken={token}
                className="w-full"
            />
        </div>
    );
};

export default BookingCard;
