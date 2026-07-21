"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RotateCcw } from "lucide-react";
import React from "react";
import { usePaymentsFilter } from "./states/usePaymentsFilter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const PaymentFilter = () => {
  const { setSearch, setDate, setStatus, search, status, date, resetFilters } = usePaymentsFilter();

  return (
    <div>
      <div className="flex items-center gap-4 md:gap-6 bg-white p-4 md:p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] mt-8 w-full">
        {/* Search Area */}
        <div className="relative flex-1">
          <Input
            className="pl-9 w-full"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="h-4 w-4 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-4">
          <div className="w-[180px]">
            <Select onValueChange={(value) => setStatus(value)} value={status}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <input
              type="date"
              value={date}
              className="w-[160px] focus-visible:ring-0 border border-input h-10 rounded-md text-sm shadow-sm px-3 py-1 cursor-pointer hover:border-gray-300 transition-colors"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Mobile Filters Dropdown */}
        <div className="md:hidden flex items-center gap-2">
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
                <Select onValueChange={(value) => setStatus(value)} value={status}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Date</p>
                <input
                  type="date"
                  value={date}
                  className="w-full focus-visible:ring-0 border border-input h-10 rounded-md text-sm shadow-sm px-3 py-1 cursor-pointer hover:border-gray-300 transition-colors"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilter;
