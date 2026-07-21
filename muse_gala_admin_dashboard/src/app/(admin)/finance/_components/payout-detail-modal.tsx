/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface PayoutDetailModalProps {
    payoutId: string | null;
    token: string;
    isOpen: boolean;
    onClose: () => void;
}

const PayoutDetailModal = ({
    payoutId,
    token,
    isOpen,
    onClose,
}: PayoutDetailModalProps) => {
    const queryClient = useQueryClient();

    const { data: payoutDetail, isLoading } = useQuery({
        queryKey: ["payout-detail", payoutId],
        queryFn: async () => {
            if (!payoutId) return null;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/${payoutId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch payout details");
            }

            const json = await res.json();
            return json.data || json;
        },
        enabled: !!payoutId && !!token && isOpen,
    });

    const transferMutation = useMutation({
        mutationFn: async () => {
            if (!payoutId) return;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/transfer/${payoutId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const error = await res.json();
                throw new Error(
                    error.message || error.error || "Transfer failed"
                );
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Payout transferred successfully!");
            queryClient.invalidateQueries({ queryKey: ["payout-detail", payoutId] });
            queryClient.invalidateQueries({ queryKey: ["pending-payouts"] });
            queryClient.invalidateQueries({ queryKey: ["lenders-payout"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to transfer payout", { duration: 4000 });
        },
    });

    const handleTransfer = () => {
        if (window.confirm("Are you sure you want to transfer this payout to the lender?")) {
            transferMutation.mutate();
        }
    };

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const payout = payoutDetail;

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-orange-100 text-orange-800";
            case "approved":
                return "bg-blue-100 text-blue-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "failed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h1 className="text-xl font-medium text-gray-900">
                                Payout Details
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                ID: {payoutId || "—"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-auto max-h-[70vh]">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : payout ? (
                            <div className="space-y-6">
                                {/* Amounts */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        Financial Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Booking Amount:</span>
                                            <span className="ml-2 font-medium">
                                                $ {payout.bookingAmount || "0"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Lender Price:</span>
                                            <span className="ml-2 font-medium">
                                                $ {payout.lenderPrice || "0"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Requested Amount:</span>
                                            <span className="ml-2 font-medium">
                                                $ {payout.requestedAmount || "0"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Commission:</span>
                                            <span className="ml-2 font-medium">
                                                {payout.commission || "0"}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* IDs & References */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        References
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Payout ID:</span>
                                            <span className="ml-2 font-medium font-mono text-xs">
                                                {payout._id || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Lender ID:</span>
                                            <span className="ml-2 font-medium font-mono text-xs">
                                                {payout.lenderId || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Booking ID:</span>
                                            <span className="ml-2 font-medium font-mono text-xs">
                                                {payout.bookingId || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Dates */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        Status & Timeline
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <span className="text-gray-500">Status:</span>
                                            <span
                                                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                                                    payout.status
                                                )}`}
                                            >
                                                {payout.status || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Requested At:</span>
                                            <span className="ml-2 font-medium">
                                                {formatDate(payout.requestedAt)}
                                            </span>
                                        </div>
                                        {payout.paidAt && (
                                            <div>
                                                <span className="text-gray-500">Paid At:</span>
                                                <span className="ml-2 font-medium">
                                                    {formatDate(payout.paidAt)}
                                                </span>
                                            </div>
                                        )}
                                        {payout.createdAt && (
                                            <div>
                                                <span className="text-gray-500">Created At:</span>
                                                <span className="ml-2 font-medium">
                                                    {formatDate(payout.createdAt)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Transfer Button */}
                                {payout.status === "pending" && (
                                    <button
                                        onClick={handleTransfer}
                                        disabled={transferMutation.isPending}
                                        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {transferMutation.isPending
                                            ? "Processing Transfer..."
                                            : "Transfer Payout to Lender"}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No payout data found
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayoutDetailModal;
