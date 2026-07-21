"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PromoOfferResponse {
  success?: boolean;
  status?: boolean;
  message?: string;
}

export default function GiveAndTake() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handlePromoOffer = async () => {
    const trimmedEmail = email.trim();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    console.info("[GiveAndTake] button clicked", {
      email: trimmedEmail,
      backendUrl,
    });

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!backendUrl) {
      console.error("[GiveAndTake] NEXT_PUBLIC_BACKEND_URL is missing");
      toast.error("Backend URL is missing");
      return;
    }

    setIsPending(true);

    try {
      const url = `${backendUrl}/api/v1/newsletterSubscription/promo-offer`;
      console.info("[GiveAndTake] sending request", url);

      const res = await fetch(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        }
      );
      const data = (await res.json()) as PromoOfferResponse;

      if (!res.ok || !(data.success ?? data.status)) {
        throw new Error(data.message || "Failed to send promo code");
      }

      toast.success(data.message || "Promo code sent successfully");
      setEmail("");
    } catch (err) {
      console.error("[GiveAndTake] request failed", err);
      toast.error(err instanceof Error ? err.message : "Failed to send promo code");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h2 className="headerClass uppercase">GET $10, GIVE $10</h2>
      <p className="text-[12px] mb-8 max-w-3xl !normal-case mx-auto font-avenir font-light">
        Get $10 off your first rental when you join. Share your code and give
        friends $10 too.
      </p>

      <div
        className="flex relative flex-col sm:flex-row justify-center items-center max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="YOUR EMAIL"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border border-t-0 border-l-0 border-r-0 border-[#000000] px-2 py-[10px] mb-4 sm:mb-0 sm:flex-1 outline-none font-avenir font-light"
        />
        <button
          type="button"
          aria-label="Send promo code"
          className="ml-0 absolute right-0 sm:ml-2 inline-flex h-10 w-10 items-center justify-center disabled:pointer-events-none disabled:opacity-50"
          onClick={handlePromoOffer}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-5 w-6 animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
