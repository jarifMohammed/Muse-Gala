'use client'
import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { format, addDays, isAfter, isBefore, isSameDay } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { useShoppingStore } from '@/zustand/shopingStore'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const RentalDates = () => {
  const { rent, startDate, setStartDate, endDate, setEndDate, eventDay, setEventDay } = useShoppingStore()
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const pathName = usePathname()
  const isCheckoutPage =
    pathName?.startsWith('/shop/checkout') && !pathName.includes('/confirmation')

  // 🧭 Handle user click on calendar with smart logic
  const handleSelect = (clickedDate: Date | undefined) => {
    if (!clickedDate) return
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (clickedDate < today) return
    // Reset if same date clicked
    if (eventDay && isSameDay(clickedDate, eventDay)) {
      resetDates()
      return
    }
    // Calculate rental window
    let from, to
    if (Number(rent) === 4) {
      from = addDays(clickedDate, -2)
      to = addDays(clickedDate, 1)
    } else if (Number(rent) === 8) {
      from = addDays(clickedDate, -6)
      to = addDays(clickedDate, 1)
    } else {
      from = clickedDate
      to = addDays(clickedDate, Number(rent) - 1)
    }
    setStartDate(from)
    setEndDate(to)
    setSelectedRange({ from, to })
    setEventDay(clickedDate)
  }

  // Reset function
  const resetDates = () => {
    setStartDate(null)
    setEndDate(null)
    setSelectedRange(undefined)
    setEventDay(null)
  }

  // 🧹 Sync when rent duration changes
  useEffect(() => {
    if (eventDay) {
      let from, to
      if (Number(rent) === 4) {
        from = addDays(eventDay, -2)
        to = addDays(eventDay, 1)
      } else if (Number(rent) === 8) {
        from = addDays(eventDay, -6)
        to = addDays(eventDay, 1)
      } else {
        from = eventDay
        to = addDays(eventDay, Number(rent) - 1)
      }
      setStartDate(from)
      setEndDate(to)
      setSelectedRange({ from, to })
    }
  }, [rent, eventDay, setStartDate, setEndDate])

  // 🧹 Sync selectedRange when startDate/endDate hydrated from store
  useEffect(() => {
    if (startDate && endDate) {
      setSelectedRange({ from: startDate, to: endDate })
    }
  }, [startDate, endDate])

  // 🧹 Cleanup if startDate reset elsewhere
  useEffect(() => {
    if (!startDate) {
      setSelectedRange(undefined)
      setEventDay(null)
    }
  }, [startDate, setEventDay])

  // 🖥️ Display text in button
  const displayDate =
    eventDay && selectedRange?.from && selectedRange?.to
      ? (
        <div className="flex flex-col items-start gap-0.5 whitespace-normal text-left">
          <span>Event Day: {format(eventDay, 'MMM dd, yyyy')}</span>
          <span className="text-[10px] sm:text-xs opacity-70">
            Rental: {format(selectedRange.from, 'MMM dd')} - {format(selectedRange.to, 'MMM dd')}
          </span>
        </div>
      )
      : null

  if (isCheckoutPage) {
    return (
      <div className="mt-3 w-full max-w-full overflow-hidden border-b border-black/20 pb-3">
        {eventDay && selectedRange?.from && selectedRange?.to ? (
          <div className="tracking-widest text-gray-600 font-light uppercase text-sm leading-relaxed">
            <p>Event Day: {format(eventDay, 'MMM dd, yyyy')}</p>
            <p className="text-xs opacity-70">
              Rental: {format(selectedRange.from, 'MMM dd')} - {format(selectedRange.to, 'MMM dd')}
            </p>
          </div>
        ) : (
          <p className="tracking-widest text-gray-600 font-light uppercase text-sm">
            Event date not selected
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-3 w-full max-w-full overflow-hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between tracking-widest text-gray-600 font-light border rounded-md h-auto min-h-[40px] py-1.5 px-3',
              !displayDate && 'text-muted-foreground items-center'
            )}
          >
            <div className="flex-1 text-left whitespace-normal">
              {displayDate || 'Select Event Day'}
            </div>
            <CalendarIcon className="h-4 w-4 opacity-50 shrink-0 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 max-w-[95vw] sm:max-w-none" align="start">
          {/* Reset Button */}
          {displayDate && (
            <div className="p-3 border-b flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDates}
                className="h-8 px-2 text-gray-600"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          )}

          <Calendar
            mode="single"
            selected={eventDay || undefined}
            onSelect={handleSelect}
            numberOfMonths={1}
            disabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
            modifiers={{
              rentalPeriod: (date) =>
                !!(selectedRange?.from && selectedRange?.to &&
                  (isSameDay(date, selectedRange.from) ||
                    isSameDay(date, selectedRange.to) ||
                    (isAfter(date, selectedRange.from) &&
                      isBefore(date, selectedRange.to)))),
              eventDay: (date) => !!(eventDay && isSameDay(date, eventDay)),
            }}
            modifiersClassNames={{
              rentalPeriod: 'bg-gray-200 text-gray-800',
              eventDay: '!bg-black !text-white font-medium shadow-sm scale-90 ring-1 ring-black/10',
            }}
          />

          <div className="p-3 text-xs text-gray-500 border-t text-center pt-1 font-light tracking-wide font-avenir leading-relaxed">
            Select your event day. <br /> Rental period will be shown automatically.
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default RentalDates
