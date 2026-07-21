import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchDisputes = () => {
  return (
    <div className="bg-white p-5 rounded-lg mt-8 shadow-[0px_4px_10px_0px_#0000001A] h-[100px] flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Input
            className="w-[264px] pl-8 focus-visible:ring-0"
            placeholder="Search..."
          />
          <Search className="h-5 w-5 opacity-75 absolute top-1/4 left-2" />
        </div>

        <div className="flex items-center gap-5">
          <Select>
            <SelectTrigger className="w-[180px] focus-visible:ring-0">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Times</SelectLabel>
                <SelectItem value="apple">10.00 AM</SelectItem>
                <SelectItem value="banana">11.00 AM</SelectItem>
                <SelectItem value="blueberry">1.00 AM</SelectItem>
                <SelectItem value="grapes">2.00 AM</SelectItem>
                <SelectItem value="pineapple">3.00 AM</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] focus-visible:ring-0">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>All</SelectLabel>
                <SelectItem value="apple">10.00 AM</SelectItem>
                <SelectItem value="banana">11.00 AM</SelectItem>
                <SelectItem value="blueberry">1.00 AM</SelectItem>
                <SelectItem value="grapes">2.00 AM</SelectItem>
                <SelectItem value="pineapple">3.00 AM</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchDisputes;
