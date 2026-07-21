import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type BookingDetails = {
  deliveryStatus?: string;
  updatedAt?: string;
};

const BookingStatus = ({ bookingDetails }: { bookingDetails?: BookingDetails }) => {
  return (
    <div className="mt-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4">Booking Status</h1>

        <div className="text-sm space-y-2">
          <h3 className="flex items-center gap-1">
            <span>Current Status: </span>
            <span
              className={`${bookingDetails?.deliveryStatus === "Pending" && "text-orange-600"
                } ${bookingDetails?.deliveryStatus === "Delivered" && "text-green-600"
                } ${bookingDetails?.deliveryStatus === "CancelledByCustomer" && "text-red-600"
                }`}
            >
              {bookingDetails?.deliveryStatus || "N/A"}
            </span>
          </h3>
          <h3>Last Updated: {new Date(bookingDetails?.updatedAt ?? "").toLocaleDateString()}</h3>
        </div>
      </div>

      <div className="mt-5">
        <h1 className="mb-2">Update Status</h1>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="update status" />
          </SelectTrigger>
          <SelectContent className="">
            <SelectGroup>
              <SelectItem value="active">Pending</SelectItem>
              <SelectItem value="dispute">Disputed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <h1 className="mb-2">Reason for Change</h1>
        <Textarea className="h-[150px]" />
      </div>

      <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-10">
        <h1 className="text-xl font-semibold mb-4">Actions</h1>

        <div className="text-sm">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
