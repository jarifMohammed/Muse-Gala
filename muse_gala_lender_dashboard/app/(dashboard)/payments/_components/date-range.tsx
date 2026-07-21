import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const DateRange = () => {
  return (
    <div className="mt-5">
      <h1 className="font-medium mb-2">
        Date Range <span className="text-xl text-red-500">*</span>
      </h1>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-5">
              <div>
                <input
                  type="date"
                  className="w-[180px] focus-visible:ring-0 border border-input h-9 rounded-md text-base shadow-sm px-3 py-1 bg-inherit"
                />
              </div>
            </div>

            <div>
              <div className="w-5 h-1 border-b-2 border-black"></div>
            </div>

            <div className="flex items-center gap-5">
              <div>
                <input
                  type="date"
                  className="w-[180px] focus-visible:ring-0 border border-input h-9 rounded-md text-base shadow-sm px-3 py-1 bg-inherit"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Select>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Pending</SelectItem>
              <SelectItem value="dark">Disputed</SelectItem>
              <SelectItem value="system">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DateRange;
