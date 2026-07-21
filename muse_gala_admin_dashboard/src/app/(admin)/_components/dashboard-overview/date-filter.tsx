// ==================== FILE: _components/DateFilter.tsx ====================
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, startOfMonth, endOfMonth } from 'date-fns'

interface DateFilterProps {
  onDateChange: (startDate: string, endDate: string) => void
}

export function DateFilter({ onDateChange }: DateFilterProps) {
  const currentDate = new Date()
  const [filterType, setFilterType] = useState<'monthly' | 'custom'>('monthly')
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: startOfMonth(currentDate),
    to: endOfMonth(currentDate),
  })

  const handleFilterChange = (type: 'monthly' | 'custom') => {
    setFilterType(type)
    if (type === 'monthly') {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      setDateRange({ from: start, to: end })
      onDateChange(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateRangeChange = (range: any) => {
    if (range?.from && range?.to) {
      setDateRange(range)
      onDateChange(
        format(range.from, 'yyyy-MM-dd'),
        format(range.to, 'yyyy-MM-dd'),
      )
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-black text-white hover:bg-gray-800 hover:text-white"
        >
          {filterType === 'monthly' ? 'Monthly' : 'Custom Range'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-4 space-y-3">
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                className="font-light tracking-wider "
                value="monthly"
              >
                Monthly
              </SelectItem>
              <SelectItem className="font-light tracking-wider " value="custom">
                Custom Range
              </SelectItem>
            </SelectContent>
          </Select>
          {filterType === 'custom' && (
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
