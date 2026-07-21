import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const Description = () => {
  return (
    <div className="mt-5">
      <h1 className="font-medium mb-2">
        Description <span className="text-gray-400">(Optional)</span>
      </h1>

      <Textarea className="h-[150px]" />
    </div>
  );
};

export default Description;
