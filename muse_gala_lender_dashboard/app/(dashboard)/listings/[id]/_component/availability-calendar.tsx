"use client";
import dayjs from "dayjs";

interface CalendarProps {
  year: number;
  month: number; // 0 = Jan, 11 = Dec
  greenDates?: number[]; // highlight in green
  redDates?: number[]; // highlight in red
  yellowDates?: number[]; // highlight in yellow
}

export default function AvailabilityCalendar({
  year,
  month,
  greenDates = [],
  redDates = [],
  yellowDates = [],
}: CalendarProps) {
  const today = dayjs();

  const startOfMonth = dayjs(new Date(year, month, 1));
  const endOfMonth = startOfMonth.endOf("month");
  const daysInMonth = endOfMonth.date();

  // First day offset for grid alignment (0 = Sunday, 1 = Monday, etc.)
  const startDay = startOfMonth.day();

  // Generate all days with placeholders before first day
  //   const dates: (number | null)[] = [
  //     ...Array.from({ length: startDay }, () => null),
  //     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  //   ];

  const prevMonth = startOfMonth.subtract(1, "month");
  const prevMonthDays = prevMonth.daysInMonth();
  const prevMonthDates = Array.from(
    { length: startDay },
    (_, i) => prevMonthDays - startDay + i + 1
  );

  const totalCells = 42; // 6 rows × 7 days
  const currentCells = startDay + daysInMonth;
  const nextMonthDays = totalCells - currentCells;
  const nextMonthDates = Array.from({ length: nextMonthDays }, (_, i) => i + 1);

  const allDates: (number | null | { date: number; isOtherMonth: boolean })[] =
    [
      ...prevMonthDates.map((date) => ({ date, isOtherMonth: true })),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
      ...nextMonthDates.map((date) => ({ date, isOtherMonth: true })),
    ];

  return (
    <div className="w-full mx-auto bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {d}
          </div>
        ))}

        {/* Dates */}
        {allDates.map((dateItem, idx) => {
          if (typeof dateItem === "object" && dateItem?.isOtherMonth) {
            // Previous/next month dates
            return (
              <div
                key={idx}
                className="h-10 flex items-center justify-center text-sm text-gray-400"
              >
                {dateItem.date}
              </div>
            );
          }

          const date = dateItem as number;
          const dateObj = dayjs(new Date(year, month, date));
          const isPast = dateObj.isBefore(today.startOf("day"));

          const isGreen = greenDates.includes(date);
          const isRed = redDates.includes(date);
          const isYellow = yellowDates.includes(date);

          return (
            <div
              key={idx}
              className={`h-10 flex items-center justify-center text-sm font-medium rounded-md cursor-pointer transition-colors
                ${isPast ? "text-gray-400 cursor-not-allowed" : "text-gray-900"}
                ${isGreen ? "bg-green-100 text-green-700" : ""}
                ${isRed ? "bg-red-100 text-red-700" : ""}
                ${isYellow ? "bg-yellow-100 text-yellow-700" : ""}
                ${
                  !isPast && !isGreen && !isRed && !isYellow
                    ? "hover:bg-gray-50"
                    : ""
                }
              `}
            >
              {date}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-start gap-4 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">Shipping</span>
        </div>
      </div>
    </div>
  );
}
