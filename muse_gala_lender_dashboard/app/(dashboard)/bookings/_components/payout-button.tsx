"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, AlertCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const PayoutButton = ({
  id,
  token,
  userID,
  paymentStatus,
  payoutStatus,
}: {
  id: string;
  token: string;
  userID: string;
  paymentStatus: string;
  payoutStatus?: string;
}) => {
  const queryClient = useQueryClient();

  const getProfileData = (userData: any) => {
    if (userData?.data?.user) return userData.data.user;
    if (userData?.user) return userData.user;
    if (userData?.data) return userData.data;
    return userData;
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-payout"],
    mutationFn: async (bId: string) => {
      console.log("Mutation started for ID:", bId);
      // 1. Fetch latest user profile to check payout settings
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userRes.ok) {
        throw new Error("Failed to verify payout settings");
      }

      const userData = await userRes.json();
      const profile = getProfileData(userData);
      const settings = profile?.payoutSettings;

      // 2. Validate based on preferred method (Stripe | Manual)
      if (settings?.preferredMethod === "Manual") {
        if (settings.manualMethod === "BankTransfer") {
          const bank = settings.bankDetails;
          if (!bank?.accountName || !bank?.bsb || !bank?.accountNumber) {
            throw new Error("Please set up your preferred payout method in account settings to continue,");
          }
        } else if (settings.manualMethod === "PayID") {
          const payid = settings.payIDDetails;
          if (!payid?.value) {
            throw new Error("Please complete your PayID details in Account Settings first.");
          }
        } else {
          throw new Error("Please select a payout method in Account Settings first.");
        }
      } else {
        // Default to Stripe (or explicitly selected Stripe)
        if (!profile?.stripeOnboardingCompleted || !profile?.payoutsEnabled) {
          throw new Error("Please connect and complete your Stripe onboarding in Account Settings first.");
        }
      }

      // 3. If validation passes, create payout request
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bookingId: bId }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create payout request");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Payout requested successfully");
      queryClient.invalidateQueries({ queryKey: ["payouts-all"] });
    },
    onError: (error: any) => {
      toast.error(error.message, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        duration: 5000,
      });
    },
  });

  const handlePayout = async (bookingId: any) => {
    console.log("handlePayout called with:", bookingId);
    try {
      await mutateAsync(bookingId);
    } catch (error) {
      console.log(`error from handle payout : ${error}`);
    }
  };

  return (
    <Button
      disabled={
        paymentStatus === "Pending" ||
        paymentStatus === "NotCharged" ||
        isPending ||
        (!!payoutStatus && payoutStatus !== "pending")
      }
      onClick={() => {
        console.log("Payout button clicked. Prop id:", id);
        handlePayout(id);
      }}
      className="bg-black hover:bg-[#000000ce] disabled:bg-[#000000ce] disabled:cursor-not-allowed min-w-[100px]"
    >
      {isPending ? (
        <h1 className="flex items-center gap-2">
          <LoaderCircle className="animate-spin h-4 w-4" />
          <span>Validating...</span>
        </h1>
      ) : payoutStatus && payoutStatus !== "pending" ? (
        <span>
          {payoutStatus === "requested"
            ? "Payout requested"
            : payoutStatus.charAt(0).toUpperCase() + payoutStatus.slice(1)}
        </span>
      ) : (
        "Payout"
      )}
    </Button>
  );
};

export default PayoutButton;
