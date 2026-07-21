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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Plus, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useListingFilterStrate } from "./listing-searchbar-state";
import { cn } from "@/lib/utils";

const ListingSearchHeader: FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    pickupFilter,
    setPickupOption,
    setSizeFilter,
    sizeFilter,
    resetFilters,
  } = useListingFilterStrate();

  const statusOptions = ["All", "available", "booked", "not-available"];
  const sizeOptions = [
    "All", "XXS", "XS", "S", "M", "L", "XL", "Custom",
  ];

  // Maps display label → backend value
  const deliveryOptions = [
    { label: "Shipping", value: "Australia-wide" },
    { label: "Local Pick Up", value: "Local-Pickup" },
    { label: "Shipping & Pick Up", value: "Both" },
  ];



  const activeFiltersCount = [
    statusFilter !== "All",
    sizeFilter !== "All",
    !!pickupFilter,
  ].filter(Boolean).length;

  return (
    <div className="bg-white p-2.5 sm:p-4 rounded-xl shadow-sm border border-gray-100">
      {/* Container with flex to ensure horizontal alignment on ALL screens */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Search Bar - Flex-1 to take the most available space */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 h-9 sm:h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all w-full rounded-lg text-xs sm:text-sm"
          />
        </div>

        {/* Filters and Add Button - Staying on the same row */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Filters Consolidated into one Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 sm:h-11 px-2 sm:px-4 gap-1.5 sm:gap-2 border-gray-200 hover:bg-gray-50 rounded-lg shrink-0",
                  activeFiltersCount > 0 && "border-[#891d33]/30 bg-[#891d33]/5 text-[#891d33]"
                )}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex items-center justify-center bg-[#891d33] text-white text-[9px] sm:text-[10px] font-bold rounded-full min-w-[17px] h-[17px] sm:h-[18px] px-1 ml-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] sm:w-80 p-4 sm:p-5 space-y-3 sm:space-y-4" align="end">
              <div className="flex justify-between items-center border-b pb-2 sm:pb-3 mb-1 sm:mb-2">
                <h3 className="font-semibold text-xs sm:text-sm">Advanced Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-7 sm:h-8 text-[10px] sm:text-[11px] text-[#891d33] hover:bg-red-50 gap-1 sm:gap-1.5 px-2"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="h-8 sm:h-9 text-xs">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option} className="capitalize text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size Filter */}
              <div className="space-y-1">
                <label htmlFor="size-filter" className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Size</label>
                <Select value={sizeFilter} onValueChange={setSizeFilter}>
                  <SelectTrigger id="size-filter" className="h-8 sm:h-9 text-xs">
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>



              {/* Delivery Filter */}
              <div className="space-y-1">
                <label htmlFor="delivery-filter" className="text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Delivery Type</label>
                <Select value={pickupFilter} onValueChange={setPickupOption}>
                  <SelectTrigger id="delivery-filter" className="h-8 sm:h-9 text-xs">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full bg-[#891d33] hover:bg-[#891d33]/90 h-8 sm:h-9 rounded-lg text-xs font-semibold"
                  onClick={() => {
                    // Filter selection is immediate
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Add New Listing Button */}
          <Button asChild effect="shineHover" className="h-9 sm:h-11 px-3 sm:px-5 gap-1.5 sm:gap-2 bg-[#891d33] hover:bg-[#891d33]/90 rounded-lg shadow-sm shrink-0">
            <Link href="/listings/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline whitespace-nowrap text-xs sm:text-sm">Add New Listing</span>
              <span className="sm:hidden text-xs sm:text-sm">Add</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListingSearchHeader;

