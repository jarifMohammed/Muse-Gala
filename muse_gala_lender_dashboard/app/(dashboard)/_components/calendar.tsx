"use client";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, CalendarIcon } from "lucide-react";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { SearchInput } from "@/components/ui/search-input";
import dayjs, { Dayjs } from 'dayjs';
import { CustomDateRangePicker } from "@/components/ui/custom-date-range-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/lib/utils";

interface Event {
  bookingId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  dressName: string;
  customer: string;
  status: string;
  deliveryStatus?: string;
}

interface CalendarData {
  startDate: string;
  endDate: string;
  totalEvents: number;
  events: Event[];
}

const Calendar = ({ token }: { token: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<{
    date: Date;
    events: Event[];
    element: DOMRect;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const isMobile = useIsMobile();

  const calendarRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<{ data: CalendarData }>({
    queryKey: ["calendar-data", dateRange[0]?.toISOString(), dateRange[1]?.toISOString()],
    queryFn: async () => {
      const start = dateRange[0]?.format('YYYY-MM-DD');
      const end = dateRange[1]?.format('YYYY-MM-DD');

      const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/overview/rental-calendar`);
      if (start && end) {
        url.searchParams.append("startDate", start);
        url.searchParams.append("endDate", end);
      } else {
        // Fallback to current month if no range is selected (shouldn't happen with default state)
        url.searchParams.append("startDate", dayjs().startOf('month').format('YYYY-MM-DD'));
        url.searchParams.append("endDate", dayjs().endOf('month').format('YYYY-MM-DD'));
      }

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    },
  });

  // Calculate tooltip position
  useEffect(() => {
    if (hoveredDate && tooltipRef.current) {
      const calendarRect = calendarRef.current?.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let left = hoveredDate.element.left;
      let top = hoveredDate.element.bottom + 8;

      // Adjust horizontal position to prevent overflow
      if (left + tooltipRect.width > window.innerWidth - 20) {
        left = window.innerWidth - tooltipRect.width - 20;
      }

      // Adjust vertical position to prevent overflow
      if (top + tooltipRect.height > window.innerHeight - 20) {
        top = hoveredDate.element.top - tooltipRect.height - 8;
      }

      setTooltipPosition({ top, left });
    }
  }, [hoveredDate]);

  // Get unique dress names for filter
  const dressNames = useMemo(() => {
    if (!data?.data?.events) return [];
    const names = data.data.events.map((event) => event.dressName);
    return ["All", ...Array.from(new Set(names))];
  }, [data?.data?.events]);

  // Filter events based on search term
  const DELIVERY_STATUS_DOT_COLOR: Record<string, string> = {
    "Pending": "bg-yellow-400",
    "Accepted by Lender": "bg-green-500",
    "AcceptedByLender": "bg-green-500",
    "Return Due": "bg-orange-500",
    "Returned": "bg-orange-400",
    "Disputed": "bg-red-500",
    // ShippedToCustomer is filtered out — not shown on calendar
  };

  const getDotColor = (deliveryStatus?: string) => {
    if (!deliveryStatus) return "bg-[#891d33]";
    return DELIVERY_STATUS_DOT_COLOR[deliveryStatus] ?? "bg-[#891d33]";
  };

  const filteredEvents = useMemo(() => {
    if (!data?.data?.events) return [];
    // Hide bookings that have already been shipped — lender has no pending action
    const activeEvents = data.data.events.filter(
      (event) => event.deliveryStatus !== "ShippedToCustomer"
    );
    if (!searchTerm.trim()) return activeEvents;
    return activeEvents.filter((event) =>
      event.dressName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.data?.events, searchTerm]);

  // Generate calendar days dynamically based on the month and year from API
  const calendarDays = useMemo(() => {
    if (!data?.data?.startDate) return [];

    const start = dayjs(data.data.startDate);
    const month = start.month() + 1;
    const year = start.year();

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfPrevMonth = new Date(year, month - 1, 0).getDate();

    const days = [];

    // Add days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: lastDayOfPrevMonth - i,
        month: "prev" as const,
        date: new Date(year, month - 2, lastDayOfPrevMonth - i),
        events: [],
      });
    }

    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateString = currentDate.toISOString().split("T")[0];

      const dayEvents = filteredEvents.filter((event) => {
        const eventStartDate = dayjs(event.rentalStartDate).format('YYYY-MM-DD');
        const eventEndDate = dayjs(event.rentalEndDate).format('YYYY-MM-DD');
        return dateString >= eventStartDate && dateString <= eventEndDate;
      });

      days.push({
        day,
        month: "current" as const,
        date: currentDate,
        events: dayEvents,
      });
    }

    // Add days from next month to complete the grid
    const totalCells = 42;
    const remainingCells = totalCells - days.length;

    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        month: "next" as const,
        date: new Date(year, month, day),
        events: [],
      });
    }

    return days;
  }, [data?.data, filteredEvents]);

  // Get month name from month number
  const getMonthName = (monthNumber: number) => {
    return new Date(2000, monthNumber - 1, 1).toLocaleString("default", {
      month: "long",
    });
  };



  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle date hover
  const handleDateHover = (
    date: { date: Date; events: Event[] },
    event: React.MouseEvent
  ) => {
    const elementRect = event.currentTarget.getBoundingClientRect();
    setHoveredDate({ ...date, element: elementRect });
  };

  // Handle mouse leave from calendar area
  const handleCalendarMouseLeave = (event: React.MouseEvent) => {
    if (!tooltipRef.current?.contains(event.relatedTarget as Node)) {
      setHoveredDate(null);
    }
  };

  // Calendar Skeleton Component
  const CalendarSkeleton = () => (
    <div className="lg:col-span-2 bg-white p-6 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="h-7 w-40 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Dress Search Skeleton */}
          <div className="h-10 w-full md:w-64 bg-gray-200 rounded-md animate-pulse"></div>
          {/* Date Picker Skeleton */}
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Calendar Header Skeleton */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="text-center py-2">
            <div className="h-4 bg-gray-200 rounded mx-auto w-12 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[80px] p-2 border border-gray-100 rounded-lg bg-gray-50 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-6 mb-2"></div>
            <div className="flex justify-center">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center space-x-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div
      ref={calendarRef}
      className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-[15px] shadow-[0px_4px_10px_0px_#0000001A] relative"
      onMouseLeave={handleCalendarMouseLeave}
    >
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          {/* Dress Search */}
          <div className="flex-1 min-w-[150px] sm:w-64">
            <SearchInput
              placeholder="Search dress..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
              className="h-10"
            />
          </div>

          {/* Date Range Picker */}
          {isMobile ? (
            <Sheet open={isPickerOpen} onOpenChange={setIsPickerOpen}>
              <SheetTrigger asChild>
                <button className="h-10 px-3 sm:px-4 bg-[#891d33] text-white rounded-md flex items-center text-sm hover:bg-[#6a1526] transition-colors gap-2 flex-shrink-0">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden xs:inline">
                    {dateRange[0] && dateRange[1]
                      ? `${dateRange[0].format('MMM D')} - ${dateRange[1].format('MMM D')}`
                      : "Select Dates"}
                  </span>
                  <span className="xs:hidden text-xs">Dates</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-0 h-auto rounded-t-3xl border-none">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Select Date Range</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center">
                  <CustomDateRangePicker
                    value={dateRange}
                    onChange={(newValue) => setDateRange(newValue)}
                    onClose={() => setIsPickerOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
              <PopoverTrigger asChild>
                <button className="h-10 px-3 sm:px-4 bg-[#891d33] text-white rounded-md flex items-center text-sm hover:bg-[#6a1526] transition-colors gap-2 flex-shrink-0">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden xs:inline">
                    {dateRange[0] && dateRange[1]
                      ? `${dateRange[0].format('MMM D')} - ${dateRange[1].format('MMM D')}`
                      : "Select Dates"}
                  </span>
                  <span className="xs:hidden text-xs">Dates</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto bg-white border-none shadow-2xl z-[60]" align="end">
                <CustomDateRangePicker
                  value={dateRange}
                  onChange={(newValue) => setDateRange(newValue)}
                  onClose={() => setIsPickerOpen(false)}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="max-w-full overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-7 gap-1 mb-4 min-w-[500px] md:min-w-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-600 text-xs sm:text-sm py-2"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((date, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border border-gray-100 rounded-lg transition-all duration-200 relative",
                  date.month !== "current" ? "bg-gray-50 text-gray-400" : "bg-white text-gray-900",
                  date.events.length > 0 && "border-l-4 border-l-[#891d33]",
                  date.month === "current" && "hover:bg-gray-50 hover:shadow-sm cursor-pointer"
                )}
                onMouseEnter={(e) => handleDateHover(date, e)}
              >
                <div
                  className={cn(
                    "text-xs sm:text-sm font-medium mb-1",
                    date.month !== "current" && "text-gray-400"
                  )}
                >
                  {date.day}
                </div>

                {/* Event Count Badge */}
                {date.events.length > 0 && (
                  <div className="flex justify-center gap-1 mt-1">
                    {date.events.slice(0, 3).map((event, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full inline-block ${getDotColor(event.deliveryStatus)}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip - Fixed Position */}
      {hoveredDate && hoveredDate.events.length > 0 && (
        <div
          ref={tooltipRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-sm transition-opacity duration-200"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
          onMouseEnter={() => setHoveredDate(hoveredDate)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">
              {formatDate(hoveredDate.date)}
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {hoveredDate.events.map((event) => (
                <div
                  key={event.bookingId}
                  className="text-sm border-l-4 border-l-[#891d33] pl-3 pb-2 last:pb-0"
                >
                  <div className="font-medium text-gray-900 mb-1">
                    {event.dressName}
                  </div>
                  <div className="text-gray-600 text-xs mb-1">
                    Customer: {event.customer}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      {new Date(event.rentalStartDate).toLocaleDateString()} -{" "}
                      {new Date(event.rentalEndDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip arrow */}
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
        </div>
      )}

      {/* Legend */}
      <div className="pt-4 border-t border-gray-200 mt-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium">
          {(() => {
            const searchedEvents = !searchTerm.trim()
              ? (data?.data?.events || [])
              : (data?.data?.events || []).filter(e => e.dressName.toLowerCase().includes(searchTerm.toLowerCase()));

            return (
              <>
                {[
                  {
                    label: "Pending",
                    color: "bg-yellow-400",
                    statuses: ["Pending"],
                  },
                  {
                    label: "Accepted by Lender",
                    color: "bg-green-500",
                    statuses: ["Accepted by Lender", "AcceptedByLender"],
                  },
                  {
                    label: "Shipped",
                    color: "bg-[#891d33]",
                    statuses: ["ShippedToCustomer"],
                  },
                  {
                    label: "Return Due",
                    color: "bg-orange-500",
                    statuses: ["Return Due"],
                  },
                  {
                    label: "Returned",
                    color: "bg-orange-400",
                    statuses: ["Returned"],
                  },
                  {
                    label: "Disputed",
                    color: "bg-red-500",
                    statuses: ["Disputed"],
                  },
                ].map(({ label, color, statuses }) => {
                  const count = searchedEvents.filter((e) =>
                    statuses.includes(e.deliveryStatus ?? "")
                  ).length;

                  if (count === 0) return null;

                  return (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />
                      <span className="text-gray-600">
                        {label}
                      </span>
                      <span className="text-gray-900 font-semibold">({count})</span>
                    </div>
                  );
                })}

                <div className="ml-auto text-gray-500">
                  Total Bookings: <span className="font-semibold text-gray-800">{searchedEvents.length}</span>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
