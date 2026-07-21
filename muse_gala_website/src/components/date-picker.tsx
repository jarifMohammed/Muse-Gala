"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar } from "lucide-react"
import { format, isBefore, isAfter, isSameDay, startOfDay } from "date-fns"

interface DatePickerProps {
  label: string
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export function DatePicker({ label, value, onChange, minDate, maxDate, disabled = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const calendarRef = useRef<HTMLDivElement>(null)

  // Close the calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Generate days for the current month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Create an array of days
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth()
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleSelectDate = (date: Date) => {
    // Check if date is selectable
    if ((minDate && isBefore(date, startOfDay(minDate))) || (maxDate && isAfter(date, startOfDay(maxDate)))) {
      return
    }

    onChange(date)
    setIsOpen(false)
  }

  const isDateSelectable = (date: Date | null) => {
    if (!date) return false

    if (minDate && isBefore(date, startOfDay(minDate))) {
      return false
    }

    if (maxDate && isAfter(date, startOfDay(maxDate))) {
      return false
    }

    return true
  }

  const isSelectedDate = (date: Date | null) => {
    if (!date || !value) return false
    return isSameDay(date, value)
  }

  return (
    <div className="relative">
      <div className="relative cursor-pointer" onClick={() => !disabled && setIsOpen(!isOpen)}>
        <input
          type="text"
          placeholder="DD/MM/YYYY"
          value={value ? format(value, "dd/MM/yyyy") : ""}
          readOnly
          disabled={disabled}
          className={`w-full border-b border-black py-2 pl-2 pr-10 focus:outline-none ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          aria-label={label}
        />
        <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5" />
      </div>

      {isOpen && (
        <div ref={calendarRef} className="absolute z-10 mt-1 bg-white border border-gray-200 shadow-lg p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="font-medium">{format(currentMonth, "MMMM yyyy")}</div>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {weekdays.map((day) => (
              <div key={day} className="font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, index) => (
              <div key={index}>
                {day ? (
                  <button
                    onClick={() => handleSelectDate(day)}
                    disabled={!isDateSelectable(day)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${isSelectedDate(day) ? "bg-black text-white" : ""}
                      ${!isDateSelectable(day) ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                    `}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
