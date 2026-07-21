import React, { useState } from "react";

// Utility to parse rental period
const parseDate = (dateStr: string) => {
  const [monthName, dayStr] = dateStr.trim().replace(",", "").split(" ");
  const monthIndex = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].indexOf(monthName);
  const day = parseInt(dayStr);
  return new Date(2025, monthIndex, day);
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Sample bookings
const bookings = [
  {
    id: "BOOK001",
    rentalPeriod: "May 1 - May 4, 2025",
    dressName: "Emerald Evening Gown",
    customer: "Alice",
  },
  {
    id: "BOOK002",
    rentalPeriod: "May 21 - May 25, 2025",
    dressName: "Sunshine Maxi Dress",
    customer: "Emma",
  },
  {
    id: "BOOK003",
    rentalPeriod: "May 28 - May 30, 2025",
    dressName: "Classic Black Cocktail",
    customer: "Olivia",
  },

];

const CustomCalendar = () => {
const today = new Date();
const [currentYear, setCurrentYear] = useState(today.getFullYear());
const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalCells = 42;

  const cellDates = Array.from({ length: totalCells }).map((_, i) => {
    const day = i - firstDayOfMonth + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  // Map: cell index => booking metadata
  const bookingRenderMap: Record<
    number,
    { id: string; isCenter: boolean; tooltip: string }
  > = {};

  bookings.forEach((booking) => {
    const [startStr, endStr] = booking.rentalPeriod.split(" - ");
    const start = parseDate(startStr);
    const end = parseDate(endStr);

    if (start.getFullYear() > currentYear || end.getFullYear() < currentYear)
      return;

    const isSameMonth =
      start.getMonth() === currentMonth || end.getMonth() === currentMonth;
    if (!isSameMonth) return;

    const startDay = start.getMonth() === currentMonth ? start.getDate() : 1;
    const endDay =
      end.getMonth() === currentMonth ? end.getDate() : daysInMonth;

    const startIndex = cellDates.findIndex((d) => d === startDay);
    const endIndex = cellDates.findIndex((d) => d === endDay);

    if (startIndex === -1 || endIndex === -1) return;

    const centerIndex = Math.floor((startIndex + endIndex) / 2);

    for (let i = startIndex; i <= endIndex; i++) {
      bookingRenderMap[i] = {
        id: booking.id,
        isCenter: i === centerIndex,
        tooltip: `${booking.dressName} (${booking.customer})`,
      };
    }
  });

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 shadow-[0px_4px_10px_0px_#0000001A] bg-[#FFFFFF] rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrev} className="px-3 py-1 bg-gray-200 rounded">
          ← Prev
        </button>
        <h1 className="text-2xl font-bold text-[#891D33]">
          {monthNames[currentMonth]} {currentYear}
        </h1>
        <button onClick={handleNext} className="px-3 py-1 bg-gray-200 rounded">
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7  rounded overflow-hidden  text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className=" text-center font-medium py-2  text-sm"
          >
            {day}
          </div>
        ))}

        {cellDates.map((day, index) => {
          const booking = bookingRenderMap[index];

          return (
            <div
              key={index}
              className="relative h-20  p-1 text-gray-700"
            >
              {day && (
                <div className="absolute top-1 left-1 text-xs">{day}</div>
              )}

              {booking && (
                <div
                  className="absolute bottom-1 -left-1 -right-1 h-6 bg-[#891D33] rounded text-white flex items-center justify-center text-xs"
                  title={booking.tooltip}
                >
                  {booking.isCenter ? booking.id : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
