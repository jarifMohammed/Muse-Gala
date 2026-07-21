"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Mailbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReturnAddressSettings({
    token,
    userID,
    userInfo
}: Readonly<{
    token: string;
    userID: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userInfo: any;
}>) {
    const queryClient = useQueryClient();

    const getProfileData = (userData: any) => {
        if (userData?.data?.user) return userData.data.user;
        if (userData?.user) return userData.user;
        if (userData?.data) return userData.data;
        return userData;
    };

    const [returnAddress, setReturnAddress] = useState("");

    useEffect(() => {
        const profile = getProfileData(userInfo);
        if (profile?.returnAddress) {
            setReturnAddress(profile.returnAddress);
        }
    }, [userInfo]);

    const { mutate, isPending } = useMutation({
        mutationKey: ["update-return-address", userID],
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/${userID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ returnAddress }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to update return address");
            }

            return res.json();
        },
        onSuccess: (data) => {
            toast.success(data.message || "Return address updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["user-info", userID] });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error.message || "An error occurred while saving the return address.");
        },
    });

    const handleSubmit = () => {
        if (!returnAddress.trim()) {
            toast.error("Please enter a valid return address.");
            return;
        }
        mutate();
    };

    const savedAddress = getProfileData(userInfo)?.returnAddress || "";
    const isChanged = returnAddress !== savedAddress;

    return (
        <div className="p-4 md:p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg mt-6">
            <div className="flex items-center gap-2 mb-6">
                <Mailbox className="h-5 w-5 md:h-6 md:w-6 text-[#891D33]" />
                <h1 className="text-lg md:text-xl font-medium">Return Address</h1>
            </div>

            <div className="space-y-6">
                <div className="w-full">
                    <label htmlFor="return-address" className="block text-sm font-medium text-gray-700 mb-2">
                        Exact Return Address for Customers
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                        This exact address will be included in the return reminder emails sent to customers. Provide the complete address where you want customers to send or drop off the dress.
                    </p>
                    <Textarea
                        id="return-address"
                        placeholder="Enter your full return address here..."
                        value={returnAddress}
                        onChange={(e) => setReturnAddress(e.target.value)}
                        rows={4}
                        className="resize-none focus-visible:ring-[#891D33]"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !isChanged}
                        className="disabled:cursor-not-allowed bg-[#891D33] hover:bg-[#a0243d] text-white shadow-md transition-all duration-300"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <LoaderCircle className="animate-spin h-5 w-5" />
                                Saving Changes...
                            </span>
                        ) : (
                            "Save Return Address"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
