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
import { Filter, Search, CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useBookingsFilter } from "./states/useBookingsFilter";
import ManualBookings from "./manual-bookings";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BookingsHeader = ({ token, id }: { token: string; id: string }) => {
  const { search, setSearch, startDate, setStartDate, endDate, setEndDate, status, setStatus, deliveryType, setDeliveryType } = useBookingsFilter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState<boolean>();
  const router = useRouter();

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

  useEffect(() => {
    setIsDisabled(
      !profile?.stripeCustomerId || !profile?.defaultPaymentMethodId
    );
  }, [profile]);

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setDeliveryType("");
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 md:gap-4 w-full overflow-hidden flex-nowrap">
        <h1 className="text-base md:text-2xl font-medium uppercase tracking-tight md:tracking-[0.3rem] truncate grow">
          Bookings
        </h1>

        <div className="flex items-center gap-2 shrink-0">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isDisabled}
                  onClick={() => setIsOpen(true)}
                  className="disabled:cursor-not-allowed whitespace-nowrap"
                  size="sm"
                >
                  Manual Booking
                </Button>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Please add payment method in Account Settings first</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-3 sm:gap-6 bg-white p-4 sm:p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-8 w-full">
        <div className="relative flex-1 w-full">
          <Input
            className="pl-7 w-full h-10 text-sm"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="h-4 w-4 text-gray-500 absolute top-1/2 -translate-y-1/2 left-2" />
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 shrink-0 text-xs sm:text-sm px-3 sm:px-4"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">{isFilterVisible ? "Hide Filters" : "Show Filters"}</span>
          <span className="sm:hidden">{isFilterVisible ? "Hide" : "Filters"}</span>
        </Button>
      </div>

      {isFilterVisible && (
        <div className="flex flex-col gap-4 bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-4 w-full animate-in fade-in slide-in-from-top-2 duration-300 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0">
              Clear Filters
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end gap-6 w-full">
            <div className="w-full">
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Delivery type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shipping">Shipping</SelectItem>
                  <SelectItem value="Local Pickup">Local Pick Up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="ShippedToCustomer">Shipped</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Disputed">Disputed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <span className="text-[10px] text-gray-500 uppercase ml-1">
                Start Date
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{startDate ? format(parseISO(startDate), "PPP") : "Pick a date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="start">
                  <DayPicker
                    mode="single"
                    selected={startDate ? parseISO(startDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const offset = date.getTimezoneOffset();
                        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                        setStartDate(localDate.toISOString().split('T')[0]);
                      } else {
                        setStartDate("");
                      }
                    }}
                    className="p-3 bg-white rounded-md border"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <span className="text-[10px] text-gray-500 uppercase ml-1">
                End Date
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{endDate ? format(parseISO(endDate), "PPP") : "Pick a date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="start">
                  <DayPicker
                    mode="single"
                    selected={endDate ? parseISO(endDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const offset = date.getTimezoneOffset();
                        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                        setEndDate(localDate.toISOString().split('T')[0]);
                      } else {
                        setEndDate("");
                      }
                    }}
                    className="p-3 bg-white rounded-md border"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <ManualBookings isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default BookingsHeader;
