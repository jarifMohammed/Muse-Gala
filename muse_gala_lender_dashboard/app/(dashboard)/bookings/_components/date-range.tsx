import React, { useState, useEffect } from "react";
import { format, addDays, subDays, isSameDay, isWithinInterval, startOfDay, isBefore, isAfter } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface Props {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  rentalDurationDays: number;
  setRentalDurationDays: (days: number) => void;
}

const DateRange = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  rentalDurationDays,
  setRentalDurationDays,
}: Props) => {
  const [rentalDuration, setRentalDuration] = useState<number>(4);
  const [eventDay, setEventDay] = useState<Date | undefined>(undefined);

  const rentalOptions = [
    { id: 1, days: 4, label: "4 Days Rental" },
    { id: 2, days: 8, label: "8 Days Rental" },
  ];

  // Calculate range whenever eventDay or rentalDuration changes
  useEffect(() => {
    if (eventDay) {
      const clickedDate = startOfDay(eventDay);
      let from: Date, to: Date;

      if (rentalDuration === 4) {
        from = addDays(clickedDate, -2);
        to = addDays(clickedDate, 1);
      } else if (rentalDuration === 8) {
        from = addDays(clickedDate, -6);
        to = addDays(clickedDate, 1);
      } else {
        from = clickedDate;
        to = addDays(clickedDate, rentalDuration - 1);
      }

      setStartDate(format(from, "yyyy-MM-dd"));
      setEndDate(format(to, "yyyy-MM-dd"));

      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setRentalDurationDays(diffDays);
    }
  }, [eventDay, rentalDuration, setStartDate, setEndDate, setRentalDurationDays]);

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;

    const today = startOfDay(new Date());
    if (isBefore(day, today)) return;

    // Reset if same date clicked
    if (eventDay && isSameDay(day, eventDay)) {
      setEventDay(undefined);
      setStartDate("");
      setEndDate("");
      setRentalDurationDays(0);
      return;
    }

    setEventDay(startOfDay(day));
  };

  const handleRentalDurationChange = (days: number): void => {
    setRentalDuration(days);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return format(date, "MMM d, yyyy");
  };

  // Define modifiers for the calendar
  const from = startDate ? new Date(startDate) : null;
  const to = endDate ? new Date(endDate) : null;

  const modifiers = {
    event: (date: Date) => !!(eventDay && isSameDay(date, eventDay)),
    range: (date: Date) => !!(from && to && (
      isSameDay(date, from) || 
      isSameDay(date, to) || 
      (isAfter(date, from) && isBefore(date, to))
    )),
    rangeStart: (date: Date) => !!(from && isSameDay(date, from)),
    rangeEnd: (date: Date) => !!(to && isSameDay(date, to)),
  };

  const modifiersStyles = {
    event: {
      backgroundColor: "#000000",
      color: "white",
      borderRadius: "50%",
      fontWeight: "bold",
      transform: "scale(0.85)",
      zIndex: 20
    },
    range: {
      backgroundColor: "rgba(137, 29, 51, 0.08)",
      color: "#891d33",
    },
    rangeStart: {
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    },
    rangeEnd: {
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    }
  };

  return (
    <div className="mt-5 space-y-6">
      <div>
        <h1 className="font-medium mb-3 text-gray-900">
          Step 2: Select Event Day <span className="text-xl text-red-500">*</span>
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Rental Duration
          </label>
          <div className="flex gap-3">
            {rentalOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleRentalDurationChange(option.days)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                  rentalDuration === option.days
                    ? "bg-[#891d33] text-white border-[#891d33] shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#891d33]/50 hover:bg-gray-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Calendar Picker */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mx-auto lg:mx-0">
            <DayPicker
              mode="single"
              selected={eventDay}
              onSelect={handleDaySelect}
              disabled={(date) => isBefore(date, startOfDay(new Date()))}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rdp-custom"
              showOutsideDays
              styles={{
                caption: { color: "#891d33" },
                head_cell: { color: "#6b7280", fontWeight: "600" },
              }}
            />
          </div>

          {/* Guidelines & Summary */}
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Rental Policy</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                  <span><strong>Event Day:</strong> The day of the actual event.</span>
                </li>
                {rentalDuration === 4 ? (
                  <li className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#891d33]/10 border border-[#891d33]/20"></div>
                    <span><strong>4-Day Window:</strong> Starts 2 days before & ends 1 day after.</span>
                  </li>
                ) : (
                  <li className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#891d33]/10 border border-[#891d33]/20"></div>
                    <span><strong>8-Day Window:</strong> Starts 6 days before & ends 1 day after.</span>
                  </li>
                )}
                <li className="text-[10px] text-neutral-400 mt-2 italic">
                  * Select your event day on the calendar to automatically calculate the buffer dates.
                </li>
              </ul>
            </div>

            {eventDay && (
              <div className="p-4 bg-[#891d33]/5 rounded-xl border border-[#891d33]/10 space-y-3 animate-in fade-in slide-in-from-top-1 shadow-sm">
                <h3 className="text-sm font-bold text-[#891d33] flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Booking Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Event Date</p>
                    <p className="text-sm font-semibold text-gray-900">{format(eventDay, "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Days</p>
                    <p className="text-sm font-semibold text-gray-900">{rentalDurationDays} Days</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#891d33]/10">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Full Rental Period</p>
                  <p className="text-sm font-medium text-[#891d33]">
                    {formatDate(startDate)} — {formatDate(endDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRange;
