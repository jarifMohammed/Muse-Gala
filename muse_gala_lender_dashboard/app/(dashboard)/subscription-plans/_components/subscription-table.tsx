"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { usePaymentsFilter } from "./states/usePaymentsFilter";
import { toast } from "sonner";

interface Props {
  token: string;
  id: string;
}

type Subscription = {
  _id: string;
  name: string;
  commission: number;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
  durationDays: number;
};

type SubscriptionsResponse = {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
};

const SubscriptionTable = ({ token, id }: Props) => {
  const [page, setPage] = React.useState(1);

  const { search } = usePaymentsFilter();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${id}`,
        {
          method: "GET",
          headers: { Authorization: `bearer ${token}` },
        }
      );
      const data = await res.json();
      return data?.data;
    },
    enabled: !!token && !!id,
  });

  const { data, isLoading, isFetching } = useQuery<SubscriptionsResponse>({
    queryKey: ["subscriptions", page, search],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subscription/get-all?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return {
        data: json.data,
        total: json.data.length,
        page,
        limit: 10,
      };
    },
  });

  const subscriptions = (data?.data ?? []).filter((item) => item.price === 0);

  const currentPlanId = profile?.subscription?.planId?._id;

  return (
    <div className="space-y-4">
      {/* Plans Grid — All plans as horizontal stat-style cards */}
      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 flex-1 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((item) => {
            const isCurrentPlan = currentPlanId === item._id;
            return (
              <div
                key={item._id}
                className={`relative bg-white p-5 rounded-xl border transition-all duration-200 shadow-sm flex flex-col gap-4 ${isCurrentPlan
                    ? "border-primary ring-1 ring-primary/30 shadow-md"
                    : "border-gray-100 hover:border-primary/30 hover:shadow-md"
                  }`}
              >
                {/* Current Plan badge */}
                {isCurrentPlan && (
                  <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Current Plan
                  </span>
                )}

                {/* Plan Header */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${item.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">{item.name}</h2>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {item.price === 0 ? "Free" : `${item.currency} ${item.price}`}
                    {item.price > 0 && (
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        / {item.billingCycle}
                      </span>
                    )}
                  </p>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                )}

                {/* Stats: Commission + Duration */}
                <div className="flex gap-4 text-xs text-gray-600 border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px]">Commission</span>
                    <p className="font-semibold text-sm">{item.commission}%</p>
                  </div>
                  {item.durationDays > 0 && (
                    <div>
                      <span className="text-gray-400 uppercase tracking-wider text-[10px]">Duration</span>
                      <p className="font-semibold text-sm">{item.durationDays} days</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                {item.features && item.features.length > 0 && (
                  <ul className="space-y-1">
                    {item.features.slice(0, 3).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-2">
                  <Link href={`/subscription-plans/${item._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Details
                    </Button>
                  </Link>
                  <div className="flex-1">
                    <SubscribeButton
                      planId={item._id}
                      token={token}
                      isActive={item.isActive}
                      isSubscribed={isCurrentPlan}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl text-center text-gray-400 shadow-sm border border-gray-100">
          No subscription plans available
        </div>
      )}
    </div>
  );
};

const SubscribeButton = ({
  planId,
  token,
  isActive,
  isSubscribed,
}: {
  planId: string;
  token: string;
  isActive: boolean;
  isSubscribed: boolean;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["create-checkout-session", planId],
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payment/subscription/create-checkout-session/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create checkout session");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.type === "FREE") {
        toast.success(data.message || "Free subscription activated");
        window.location.reload();
        return;
      }
      const url = data.data?.checkoutUrl;
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Checkout URL not found");
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubscribe = async () => {
    try {
      await mutateAsync(planId);
    } catch (error) {
      console.error("Subscription Action Error:", error);
    }
  };

  return (
    <Button
      size="sm"
      className="w-full bg-primary hover:bg-primary/90 text-white text-xs"
      disabled={!isActive || isPending || isSubscribed}
      onClick={handleSubscribe}
    >
      {isPending ? (
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : isSubscribed ? (
        "Subscribed"
      ) : (
        "Subscribe"
      )}
    </Button>
  );
};

export default SubscriptionTable;
