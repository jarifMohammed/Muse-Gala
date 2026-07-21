import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const DressName = () => {
  return (
    <div>
      <div>
        <h1 className="font-medium mb-2">
          Select Dress <span className="text-xl text-red-500">*</span>
        </h1>

        <Select>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select One" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Pending</SelectItem>
            <SelectItem value="dark">Disputed</SelectItem>
            <SelectItem value="system">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DressName;
