"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
    token: string;
    userID: string;
    userInfo: any;
}

const PaymentMethods = ({ token, userID, userInfo }: Props) => {
    const router = useRouter();

    const getProfileData = (userData: any) => {
        if (userData?.data?.user) return userData.data.user;
        if (userData?.user) return userData.user;
        if (userData?.data) return userData.data;
        return userData;
    };

    const profile = getProfileData(userInfo);

    const { mutateAsync, isPending } = useMutation({
        mutationKey: ["add-card"],
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/savePaymentInfo`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `bearer ${token}`,
                    },
                }
            );
            return await res.json();
        },
        onSuccess: (data) => {
            if (data?.data?.url) {
                router.push(data.data.url);
            } else {
                toast.error("Failed to get Stripe session URL");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to initiate payment method setup");
        },
    });

    const handleAddPaymentMethod = async () => {
        try {
            await mutateAsync();
        } catch (error) {
            console.error(`Error adding payment method: ${error}`);
        }
    };

    const hasPaymentMethod = profile?.stripeCustomerId && profile?.defaultPaymentMethodId;

    return (
        <div className="bg-white p-5 md:p-8 rounded-xl shadow-[0px_4px_20px_0px_#0000000D] border border-gray-100">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Payment Methods</h2>
                        {hasPaymentMethod && (
                            <span className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                <CheckCircle2 className="h-3 w-3" />
                                Added
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 max-w-md">
                        Manage your payment methods for manual bookings and platform fees. We use Stripe for secure payment processing.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    {hasPaymentMethod ? (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="flex flex-col gap-2 px-5 py-3 bg-gray-50 rounded-xl border border-gray-100 min-w-0 md:min-w-[320px]">
                                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                                    <span>Stripe Payment Details</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Customer ID</span>
                                        <span className="font-mono font-medium text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-100">{profile?.stripeCustomerId}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Payment ID</span>
                                        <span className="font-mono font-medium text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-100">{profile?.defaultPaymentMethodId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <Button
                        onClick={handleAddPaymentMethod}
                        disabled={isPending || !!hasPaymentMethod}
                        className={`min-w-0 sm:min-w-[200px] h-11 transition-all duration-300 ${hasPaymentMethod
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-none"
                            : "bg-[#54051d] hover:bg-[#400416] text-white shadow-lg shadow-red-900/10"
                            }`}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connecting to Stripe...
                            </>
                        ) : hasPaymentMethod ? (
                            "Payment Method Added"
                        ) : (
                            "Add Payment Method"
                        )}
                    </Button>
                </div>
            </div>

            {!hasPaymentMethod && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-3">
                    <div className="mt-0.5 bg-amber-100 p-1 rounded-full">
                        <CreditCard className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-900">Action Required</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                            You haven't added a payment method yet. Please add one to enable manual bookings.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
