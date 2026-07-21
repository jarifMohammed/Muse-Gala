"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function DisputeForm() {
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    console.log("Form submitted", { description });
  };

  return (
    <div className="">
      <Card className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
        <h1 className="text-xl font-medium text-gray-900 mb-6">
          Reply to Support
        </h1>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Message
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none bg-white"
              placeholder="Describe your issue or question in detail"
            />
          </div>

          <Button onClick={handleSubmit}>Send Message</Button>
        </div>
      </Card>
    </div>
  );
}
