import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const BookingNotes = () => {
  return (
    <div className="mt-5">
      <div>
        <h1 className="mb-4 font-medium">Admin Note</h1>
        <Textarea className="h-[200px] focus-visible:ring-0" />

        <Button className="mt-5">Send</Button>
      </div>

      <div className="border border-gray-200 p-5 rounded-lg shadow-sm mt-10">
        <h1 className="text-xl font-semibold mb-4">Actions</h1>

        <div className="text-sm flex items-center gap-5">
          <Button>Save Changes</Button>
        
        </div>
      </div>
    </div>
  );
};

export default BookingNotes;
