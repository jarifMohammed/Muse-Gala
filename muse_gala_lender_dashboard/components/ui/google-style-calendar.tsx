/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  format,
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  addHours,
  getHours,
  setHours,
  setMinutes,
  isToday,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
}

interface GoogleStyleCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onAddEvent?: (start: Date, end: Date) => void;
  className?: string;
}

type CalendarView = "month" | "week" | "day" | "agenda";

export function GoogleStyleCalendar({
  events = [],
  onEventClick,
  onDateClick,
  onAddEvent,
  className,
}: GoogleStyleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<CalendarView>("month");
  const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null);
  const [showEventPopover, setShowEventPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Navigation functions
  const prevPeriod = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const nextPeriod = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowEventPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredEvent(event);

    if (calendarRef.current) {
      const rect = calendarRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: e.clientY - rect.top,
        left: e.clientX - rect.left,
      });
    }

    setShowEventPopover(true);

    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);

    if (onDateClick) {
      onDateClick(date);
    }
  };

  // Handle add event
  const handleAddEvent = (date: Date) => {
    if (onAddEvent) {
      const start = setMinutes(setHours(date, getHours(new Date()) + 1), 0);
      const end = addHours(start, 1);
      onAddEvent(start, end);
    }
  };

  // Render month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weeks: Date[][] = [];

    let week: Date[] = [];
    days.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    return (
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-7 gap-px border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center py-2 font-medium text-sm text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const dayEvents = events.filter(
                (event) =>
                  isSameDay(day, event.start) ||
                  isSameDay(day, event.end) ||
                  (event.start < day && event.end > day)
              );

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={cn(
                    "min-h-[100px] p-1 border border-gray-100",
                    !isCurrentMonth && "bg-gray-50",
                    isCurrentMonth && "bg-white",
                    isToday(day) && "bg-blue-50",
                    isSelected && "ring-2 ring-primary ring-inset"
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 text-sm rounded-full",
                        isToday(day) && "bg-primary text-white",
                        !isCurrentMonth && "text-gray-400"
                      )}
                    >
                      {format(day, "d")}
                    </span>

                    <button
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddEvent(day);
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                    {dayEvents.slice(0, 3).map((event, index) => (
                      <div
                        key={index}
                        className={cn(
                          "px-2 py-1 text-xs rounded truncate cursor-pointer",
                          event.color || "bg-blue-100 text-blue-800"
                        )}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        {event.title}
                      </div>
                    ))}

                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 pl-2">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Generate time slots from 7am to 8pm
    const timeSlots = Array.from({ length: 14 }, (_, i) => i + 7);

    return (
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-8 border-b">
          <div className="border-r p-2 text-center text-sm text-gray-500">
            Time
          </div>
          {days.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "p-2 text-center border-r",
                isToday(day) && "bg-blue-50"
              )}
            >
              <div className="font-medium">{format(day, "EEE")}</div>
              <div
                className={cn(
                  "text-sm",
                  isToday(day) ? "text-primary" : "text-gray-500"
                )}
              >
                {format(day, "MMM d")}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8">
          <div className="border-r">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b text-xs text-gray-500 text-right pr-2 pt-1"
              >
                {hour % 12 === 0 ? 12 : hour % 12}
                {hour < 12 ? "am" : "pm"}
              </div>
            ))}
          </div>

          {days.map((day) => (
            <div key={day.toString()} className="relative border-r">
              {timeSlots.map((hour) => {
                const timeSlotStart = setHours(day, hour);
                const timeSlotEnd = setHours(day, hour + 1);

                const slotEvents = events.filter((event) => {
                  return (
                    (event.start >= timeSlotStart &&
                      event.start < timeSlotEnd) ||
                    (event.end > timeSlotStart && event.end <= timeSlotEnd) ||
                    (event.start <= timeSlotStart && event.end >= timeSlotEnd)
                  );
                });

                return (
                  <div
                    key={hour}
                    className={cn(
                      "h-16 border-b",
                      isToday(day) &&
                        hour === getHours(new Date()) &&
                        "bg-blue-50"
                    )}
                    onClick={() => handleDateClick(setHours(day, hour))}
                  >
                    {slotEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute px-2 py-1 text-xs rounded overflow-hidden",
                          event.color || "bg-blue-100 text-blue-800"
                        )}
                        style={{
                          top: `${
                            (getHours(event.start) - 7) * 64 +
                            (event.start.getMinutes() / 60) * 64
                          }px`,
                          height: `${Math.max(
                            16,
                            (((getHours(event.end) - getHours(event.start)) *
                              60 +
                              (event.end.getMinutes() -
                                event.start.getMinutes())) /
                              60) *
                              64
                          )}px`,
                          width: "90%",
                          zIndex: 10,
                        }}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    // Generate time slots from 7am to 8pm
    const timeSlots = Array.from({ length: 14 }, (_, i) => i + 7);

    const dayEvents = events.filter(
      (event) =>
        isSameDay(currentDate, event.start) ||
        isSameDay(currentDate, event.end) ||
        (event.start < startOfDay(currentDate) &&
          event.end > endOfDay(currentDate))
    );

    return (
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-2 border-b">
          <div className="border-r p-2 text-center text-sm text-gray-500">
            Time
          </div>
          <div className="p-2 text-center">
            <div className="font-medium">{format(currentDate, "EEEE")}</div>
            <div className="text-sm text-gray-500">
              {format(currentDate, "MMMM d, yyyy")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="border-r">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b text-xs text-gray-500 text-right pr-2 pt-1"
              >
                {hour % 12 === 0 ? 12 : hour % 12}
                {hour < 12 ? "am" : "pm"}
              </div>
            ))}
          </div>

          <div className="relative">
            {timeSlots.map((hour) => {
              // const timeSlotStart = setHours(currentDate, hour);
              // const timeSlotEnd = setHours(currentDate, hour + 1);

              return (
                <div
                  key={hour}
                  className={cn(
                    "h-16 border-b",
                    isToday(currentDate) &&
                      hour === getHours(new Date()) &&
                      "bg-blue-50"
                  )}
                  onClick={() => handleDateClick(setHours(currentDate, hour))}
                >
                  {/* Current time indicator */}
                  {isToday(currentDate) && hour === getHours(new Date()) && (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-red-500 z-20"
                      style={{
                        top: `${
                          (getHours(new Date()) - 7) * 64 +
                          (new Date().getMinutes() / 60) * 64
                        }px`,
                      }}
                    >
                      <div className="w-3 h-3 rounded-full bg-red-500 -mt-1.5 -ml-1.5"></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Events */}
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  "absolute px-2 py-1 text-xs rounded overflow-hidden left-0 right-0 mx-2",
                  event.color || "bg-blue-100 text-blue-800"
                )}
                style={{
                  top: `${
                    (getHours(event.start) - 7) * 64 +
                    (event.start.getMinutes() / 60) * 64
                  }px`,
                  height: `${Math.max(
                    16,
                    (((getHours(event.end) - getHours(event.start)) * 60 +
                      (event.end.getMinutes() - event.start.getMinutes())) /
                      60) *
                      64
                  )}px`,
                  zIndex: 10,
                }}
                onClick={(e) => handleEventClick(event, e)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs opacity-75">
                  {format(event.start, "h:mm a")} -{" "}
                  {format(event.end, "h:mm a")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render agenda view
  const renderAgendaView = () => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);

    const monthEvents = events
      .filter(
        (event) =>
          (event.start >= startOfCurrentMonth &&
            event.start <= endOfCurrentMonth) ||
          (event.end >= startOfCurrentMonth && event.end <= endOfCurrentMonth)
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    // Group events by date
    const eventsByDate: Record<string, CalendarEvent[]> = {};
    monthEvents.forEach((event) => {
      const dateKey = format(event.start, "yyyy-MM-dd");
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    });

    return (
      <div className="bg-white rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-medium">
            Events for {format(currentDate, "MMMM yyyy")}
          </h3>
        </div>

        <div className="divide-y">
          {Object.keys(eventsByDate).length > 0 ? (
            Object.keys(eventsByDate).map((dateKey) => (
              <div key={dateKey} className="p-4">
                <div className="font-medium mb-2">
                  {format(parseISO(dateKey), "EEEE, MMMM d")}
                </div>

                <div className="space-y-2">
                  {eventsByDate[dateKey].map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => handleEventClick(event, e as any)}
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mt-1 mr-3",
                          event.color?.replace("bg-", "bg-") || "bg-blue-500"
                        )}
                      ></div>

                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-500">
                          {format(event.start, "h:mm a")} -{" "}
                          {format(event.end, "h:mm a")}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No events scheduled for this month
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render event popover
  const renderEventPopover = () => {
    if (!hoveredEvent || !showEventPopover) return null;

    return (
      <div
        ref={popoverRef}
        className="absolute bg-white rounded-lg shadow-lg border p-4 z-50 w-64"
        style={{
          top: popoverPosition.top + 10,
          left: popoverPosition.left + 10,
        }}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{hoveredEvent.title}</h3>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setShowEventPopover(false)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>
            {format(hoveredEvent.start, "MMM d, h:mm a")} -
            {isSameDay(hoveredEvent.start, hoveredEvent.end)
              ? format(hoveredEvent.end, " h:mm a")
              : format(hoveredEvent.end, " MMM d, h:mm a")}
          </span>
        </div>

        {hoveredEvent.description && (
          <div className="mt-2 text-sm">{hoveredEvent.description}</div>
        )}
      </div>
    );
  };

  return (
    <div ref={calendarRef} className={cn("relative", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPeriod}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextPeriod}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <h2 className="text-lg font-semibold">
            {view === "month" && format(currentDate, "MMMM yyyy")}
            {view === "week" &&
              `Week of ${format(startOfWeek(currentDate), "MMM d")} - ${format(
                endOfWeek(currentDate),
                "MMM d, yyyy"
              )}`}
            {view === "day" && format(currentDate, "MMMM d, yyyy")}
            {view === "agenda" && format(currentDate, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-8"
          >
            Today
          </Button>

          <div className="flex border rounded-md">
            <Button
              variant={view === "month" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className="rounded-none rounded-l-md h-8"
            >
              Month
            </Button>

            <Button
              variant={view === "week" ? "outline" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className="rounded-none border-x h-8"
            >
              Week
            </Button>

            <Button
              variant={view === "day" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className="rounded-none h-8"
            >
              Day
            </Button>

            <Button
              variant={view === "agenda" ? "outline" : "ghost"}
              size="sm"
              onClick={() => setView("agenda")}
              className="rounded-none rounded-r-md h-8"
            >
              Agenda
            </Button>
          </div>
        </div>
      </div>

      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
      {view === "agenda" && renderAgendaView()}

      {renderEventPopover()}
    </div>
  );
}
