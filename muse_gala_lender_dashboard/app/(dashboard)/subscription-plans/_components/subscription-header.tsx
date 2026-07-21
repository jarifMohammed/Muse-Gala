"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Filter, RotateCcw, Search } from "lucide-react";
import React from "react";
import PaymentsCard from "./payments-card";
import { usePaymentsFilter } from "./states/usePaymentsFilter";
import { cn } from "@/lib/utils";

const SubscriptionHeader = ({ token, id }: { token: string; id: string }) => {
  const { search, setSearch, deliveryType, setDeliveryType, status, setStatus, date, setDate } = usePaymentsFilter();

  const { data: profile = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data?.data;
    },
    enabled: !!token && !!id,
  });

  const activeFiltersCount = [!!deliveryType, !!status, !!date].filter(Boolean).length;

  const resetFilters = () => {
    setDeliveryType("");
    setStatus("");
    setDate("");
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-xl md:text-2xl font-medium uppercase tracking-tight md:tracking-[0.3rem]">
        Subscription Plans
      </h1>

      {/* Subscription info card */}
      <PaymentsCard profile={profile} />


    </div>
  );
};

export default SubscriptionHeader;
