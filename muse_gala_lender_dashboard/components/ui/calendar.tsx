"use client"

import { useState } from "react"
import {
  format,
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarProps {
  bookings: Array<{
    id: string
    startDate: Date
    endDate: Date
  }>
  onDateClick?: (date: Date) => void
  className?: string
}

export function Calendar({ bookings, onDateClick, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Add days from previous and next month to fill the calendar grid
  const startDay = monthStart.getDay()
  const endDay = 6 - monthEnd.getDay()

  const prevMonthDays =
    startDay > 0 ? eachDayOfInterval({ start: addDays(monthStart, -startDay), end: addDays(monthStart, -1) }) : []

  const nextMonthDays =
    endDay > 0 ? eachDayOfInterval({ start: addDays(monthEnd, 1), end: addDays(monthEnd, endDay) }) : []

  const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Group days by week
  const weeks: Date[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  // Check if a date has a booking
  const getBookingForDate = (date: Date) => {
    if (!bookings || !Array.isArray(bookings)) return null

    return bookings.find((booking) => {
      if (!booking || !booking.startDate || !booking.endDate) return false

      const bookingStart = booking.startDate instanceof Date ? booking.startDate : new Date(booking.startDate)
      const bookingEnd = booking.endDate instanceof Date ? booking.endDate : new Date(booking.endDate)

      // Check if date is within booking period
      return isWithinInterval(date, { start: bookingStart, end: bookingEnd })
    })
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    if (onDateClick) {
      onDateClick(date)
    }
  }

  // Get date class based on booking status
  const getDateClass = (date: Date) => {
    const booking = getBookingForDate(date)
    const isSelected = selectedDate && isSameDay(date, selectedDate)

    if (isSelected) return "bg-primary text-white"
    if (!booking) return ""

    // First day of booking
    if (isSameDay(date, booking.startDate)) return "bg-green-100 text-green-800"
    // Last day of booking
    if (isSameDay(date, booking.endDate)) return "bg-yellow-100 text-yellow-800"
    // Middle days of booking
    return "bg-rose-100 text-rose-800"
  }

  return (
    <div className={cn("bg-white rounded-lg", className)}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-md">
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</div>
          <button onClick={goToToday} className="text-xs text-primary hover:underline mt-1">
            Today
          </button>
        </div>

        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-md">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium mb-2 text-sm">
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const booking = getBookingForDate(day)
            const dateClass = getDateClass(day)

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "p-2 text-center rounded-sm relative cursor-pointer hover:bg-gray-100",
                  !isCurrentMonth && "text-gray-400",
                  dateClass,
                )}
                onClick={() => handleDateClick(day)}
              >
                <span
                  className={cn(
                    "inline-block w-6 h-6 leading-6 rounded-full",
                    selectedDate && isSameDay(day, selectedDate) && "bg-primary text-white",
                  )}
                >
                  {day.getDate()}
                </span>

                {booking && isCurrentMonth && (
                  <div className="absolute w-full left-0 bottom-0 mt-1 p-1 text-xs text-center rounded-sm text-ellipsis overflow-hidden">
                    <span className="text-[0.65rem]">{booking.id}</span>
                  </div>
                )}
              </div>
            )
          }),
        )}
      </div>

      <div className="flex items-center justify-start mt-4 space-x-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
          <span>Start Date</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-rose-100 rounded-full mr-1"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-100 rounded-full mr-1"></div>
          <span>End Date</span>
        </div>
      </div>
    </div>
  )
}
