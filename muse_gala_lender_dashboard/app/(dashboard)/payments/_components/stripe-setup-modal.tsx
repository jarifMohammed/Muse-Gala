"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

export function StripSetupModal() {
  const session = useSession();
  const userID = session?.data?.user?.id;
  const token = session?.data?.user?.accessToken;
  const email = session?.data?.user?.email;

  const { data: userInfo, isLoading: userLoading } = useQuery({
    queryKey: ["user-info", userID],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${userID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json?.data;
    },
    enabled: !!token && !!userID,
  });

  const { data: goToDashboard } = useQuery({
    queryKey: ["go-to-dashboard"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/stripe/account/dashboard`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json;
    },
    enabled: !!token,
  });

  const setupStripe = useMutation({
    mutationKey: ["setup-stripe"],
    mutationFn: async (email: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/onboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error("Failed to onboard Stripe");
      }

      const json = await res.json();
      return json;
    },

    onSuccess: (res) => {
      toast.success("Please Wait....");
      window.location.href = res.data.url;
    },

    onError: (error: any) => {
      toast.error(error?.error);
    },
  });

  const handleSetupStripe = async (email?: string) => {
    if (!email) {
      console.warn("No email provided for Stripe setup");
      return;
    }
    try {
      const res = await setupStripe.mutateAsync(email);
      console.log("Stripe setup response:", res);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("goToDashboard:", goToDashboard);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Setup your Stripe</DialogTitle>
      </DialogHeader>

      {userLoading ? (
        <p>Loading user info...</p>
      ) : (
        <div className="space-y-2">
          <h1>Stripe Account ID: {userInfo?.stripeAccountId || "—"}</h1>
          <h1>Charges Enabled: {String(userInfo?.chargesEnabled)}</h1>
          <h1>Payouts Enabled: {String(userInfo?.payoutsEnabled)}</h1>
          <h1>Details Submitted: {String(userInfo?.detailsSubmitted)}</h1>
          <h1>
            Stripe Onboarding Completed:{" "}
            {String(userInfo?.stripeOnboardingCompleted)}
          </h1>
        </div>
      )}

      <div className="space-x-5 mt-4">
        <Button
          disabled={setupStripe.isPending}
          onClick={() => handleSetupStripe(email)}
        >
          {setupStripe.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Setting up...
            </span>
          ) : (
            "Please Setup"
          )}
        </Button>

        <Link
          href={
            goToDashboard?.data?.url ? goToDashboard?.data?.url : "/payments"
          }
        >
          <Button variant="outline">Go to stripe dashboard</Button>
        </Link>
      </div>
    </DialogContent>
  );
}
