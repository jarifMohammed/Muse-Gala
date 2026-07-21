import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface RefundFiltersProps {
    filters: {
        page: number;
        limit: number;
        startDate?: string;
        endDate?: string;
    };
    setFilters: (filters: {
        page: number;
        limit: number;
        startDate?: string;
        endDate?: string;
    }) => void;
}

const RefundFilters = ({ filters, setFilters }: RefundFiltersProps) => {
    const handleReset = () => {
        setFilters({
            page: 1,
            limit: 10,
            startDate: "",
            endDate: "",
        });
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-end gap-6">
                <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em]">Filter by Date Range</label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">From</span>
                            <Input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                                className="text-xs h-10 pl-12 border-gray-100 bg-gray-50/30 focus:bg-white transition-all shadow-none"
                            />
                        </div>
                        <div className="w-4 h-[1px] bg-gray-200" />
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">To</span>
                            <Input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                                className="text-xs h-10 pl-10 border-gray-100 bg-gray-50/30 focus:bg-white transition-all shadow-none"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs gap-2 h-10 px-6 border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all font-medium shadow-none"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Filters
                </Button>
            </div>
        </div>
    );
};

export default RefundFilters;
