"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import DisputeCard from "./dispute-card";
import { useDisputesFilter } from "./states/useDisputesFilter";
import { SubmitDisputeModal } from "./submit-dispute-modal";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DisputeHeader = ({ token }: { token: string }) => {
  const { setSearch, status, setStatus, search, resetFilters } = useDisputesFilter();
  const [open, setOpen] = useState(false);

  const statusOptions = [
    "All",
    "Pending",
    "In Progress",
    "In Review",
    "Escalated",
    "Resolved",
    "Closed",
  ];

  const { data, isLoading } = useQuery<any>({
    queryKey: ["states-disputes"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/my-disputes`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data?.stats;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-medium uppercase tracking-[0.2rem] md:tracking-[0.3rem]">
          Disputes
        </h1>
      </div>

      <div className="mt-6 md:mt-8 grid grid-cols-3 gap-3 md:gap-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-5 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg"
            >
              <Skeleton className="h-5 w-1/2" />
              <div className="mt-8">
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))
        ) : (
          <>
            <DisputeCard title="Total" value={data?.totalDisputes} />
            <DisputeCard
              title="Pending"
              value={data?.pendingDisputes}
            />
            <DisputeCard
              title="Resolved"
              value={data?.resolvedDisputes}
            />
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 md:p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-6 md:mt-8">
        <div className="flex items-center gap-4 w-full flex-1">
          <div className="relative flex-1">
            <Input
              className="pl-9 w-full"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="h-4 w-4 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  {status === "All" ? "Status" : status}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-700 h-10 px-3"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 space-y-4" align="end">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold">Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status</p>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {status === "All" ? "Status" : status}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 w-full md:w-auto justify-center h-11 md:h-10 bg-[#54051d] hover:bg-[#6b0726] text-white shadow-md border-none transition-all duration-300"
        >
          <span>Submit Dispute</span>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {open && (
        <SubmitDisputeModal open={open} onOpenChange={() => setOpen(false)} />
      )}
    </div>
  );
};

export default DisputeHeader;
