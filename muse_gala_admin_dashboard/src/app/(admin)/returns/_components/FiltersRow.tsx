import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersRowProps {
    onFilterChange: (key: string, value: string) => void;
}

const FiltersRow = ({ onFilterChange }: FiltersRowProps) => {
    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'ReturnLinkSent', label: 'Link Sent' },
        { value: 'InTransit', label: 'In Transit' },
        { value: 'DroppedOff', label: 'Dropped Off' },
        { value: 'LateReturn', label: 'Late Return' },
        { value: 'Overdue', label: 'Overdue' },
        { value: 'Escalated', label: 'Escalated' },
        { value: 'HighRisk', label: 'High Risk' },
        { value: 'NonReturned', label: 'Non-Returned' }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search customer, email, booking ID..."
                    className="pl-10 h-10 border-gray-200"
                    onChange={(e) => onFilterChange('search', e.target.value.toLowerCase())}
                />
            </div>

            <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <Select onValueChange={(v) => onFilterChange('status', v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-[180px] h-10 border-gray-200">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={(v) => onFilterChange('daysOverdue', v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-[150px] h-10 border-gray-200">
                        <SelectValue placeholder="Any Days" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Days</SelectItem>
                        <SelectItem value="1-3">1-3 days</SelectItem>
                        <SelectItem value="4-7">4-7 days</SelectItem>
                        <SelectItem value="8-14">8-14 days</SelectItem>
                        <SelectItem value="15+">15+ days</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(v) => onFilterChange('method', v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-[150px] h-10 border-gray-200">
                        <SelectValue placeholder="Any Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Method</SelectItem>
                        <SelectItem value="ExpressShipping">Express Shipping</SelectItem>
                        <SelectItem value="LocalDropOff">Local Drop-Off</SelectItem>
                        <SelectItem value="Not selected">Not Selected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default FiltersRow;
