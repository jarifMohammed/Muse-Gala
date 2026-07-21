"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import { useFilterBooking } from "./states/useFilterBooking";

const SearchBookings = () => {
  const { setSearch, setStartDate, setEndDate, search, startDate, endDate } = useFilterBooking();

  const handleClear = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A] min-h-[100px] flex flex-col justify-center">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="relative">
          <Input
            className="w-[300px] pl-9 h-11 focus-visible:ring-1 focus-visible:ring-slate-900 border-slate-200 rounded-xl"
            placeholder="Search by ID or info..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="h-5 w-5 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3" />
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">From</span>
            <input
              type="date"
              value={startDate}
              className="w-[150px] focus:ring-1 focus:ring-slate-900 outline-none border border-slate-200 h-10 rounded-xl text-xs font-semibold px-4 text-slate-700 bg-slate-50/50"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">To</span>
            <input
              type="date"
              value={endDate}
              className="w-[150px] focus:ring-1 focus:ring-slate-900 outline-none border border-slate-200 h-10 rounded-xl text-xs font-semibold px-4 text-slate-700 bg-slate-50/50"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {(search || startDate || endDate) && (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors underline-offset-4 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBookings;
