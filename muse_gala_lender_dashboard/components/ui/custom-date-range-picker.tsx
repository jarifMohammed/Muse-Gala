"use client";

import * as React from "react";
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths, subMonths, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import dayjs, { Dayjs } from "dayjs";

interface CustomDateRangePickerProps {
    value: [Dayjs | null, Dayjs | null];
    onChange: (newValue: [Dayjs | null, Dayjs | null]) => void;
    onClose?: () => void;
}

export function CustomDateRangePicker({ value, onChange, onClose }: CustomDateRangePickerProps) {
    const [range, setRange] = React.useState<DateRange | undefined>({
        from: value[0] ? value[0].toDate() : undefined,
        to: value[1] ? value[1].toDate() : undefined,
    });

    const [month, setMonth] = React.useState<Date>(value[0] ? value[0].toDate() : new Date());

    const handleSelect = (newRange: DateRange | undefined) => {
        setRange(newRange);
    };

    const handleApply = () => {
        if (range?.from) {
            onChange([dayjs(range.from), range.to ? dayjs(range.to) : dayjs(range.from)]);
        } else {
            onChange([null, null]);
        }
        if (onClose) onClose();
    };

    const shortcuts = [
        {
            label: "This Week",
            getValue: () => ({
                from: startOfWeek(new Date()),
                to: endOfWeek(new Date()),
            }),
        },
        {
            label: "Last Week",
            getValue: () => {
                const lastWeek = subDays(new Date(), 7);
                return {
                    from: startOfWeek(lastWeek),
                    to: endOfWeek(lastWeek),
                };
            },
        },
        {
            label: "Last 7 Days",
            getValue: () => ({
                from: subDays(new Date(), 7),
                to: new Date(),
            }),
        },
        {
            label: "Current Month",
            getValue: () => ({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date()),
            }),
        },
        {
            label: "Next Month",
            getValue: () => {
                const nextMonth = addMonths(new Date(), 1);
                return {
                    from: startOfMonth(nextMonth),
                    to: endOfMonth(nextMonth),
                };
            },
        },
        {
            label: "Reset",
            getValue: () => undefined,
        },
    ];

    const handleShortcutClick = (shortcut: typeof shortcuts[0]) => {
        const newRange = shortcut.getValue();
        setRange(newRange);
        if (newRange?.from) {
            setMonth(newRange.from);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden">
            {/* Shortcuts Sidebar */}
            <div className="w-full sm:w-40 border-b sm:border-b-0 sm:border-r bg-gray-50 flex flex-col p-2 space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 tracking-wider">Shortcuts</div>
                {shortcuts.map((shortcut) => (
                    <button
                        key={shortcut.label}
                        onClick={() => handleShortcutClick(shortcut)}
                        className="text-left px-2 py-1.5 text-xs rounded-md hover:bg-gray-200 transition-colors text-gray-700 font-medium whitespace-nowrap"
                    >
                        {shortcut.label}
                    </button>
                ))}
            </div>

            {/* Calendar Area */}
            <div className="flex flex-col p-4">
                <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={handleSelect}
                    month={month}
                    onMonthChange={setMonth}
                    numberOfMonths={1}
                    className="p-0"
                    classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center mb-2",
                        caption_label: "text-sm font-semibold text-gray-900",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-7 w-7 bg-white p-0 opacity-50 hover:opacity-100 border rounded-md hover:bg-gray-100 transition-all flex items-center justify-center"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: cn(
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors"
                        ),
                        day_range_end: "day-range-end",
                        day_selected:
                            "bg-[#891d33] text-white hover:bg-[#891d33] hover:text-white focus:bg-[#891d33] focus:text-white",
                        day_today: "bg-accent text-accent-foreground",
                        day_outside:
                            "day-outside text-gray-400 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle:
                            "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                        day_hidden: "invisible",
                    }}
                    components={{
                        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                    }}
                />

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 mt-2 border-t space-x-2">
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-8">
                            Cancel
                        </Button>
                    )}
                    <Button size="sm" onClick={handleApply} className="bg-[#891d33] hover:bg-[#6a1526] text-white text-xs h-8 px-4">
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
}
