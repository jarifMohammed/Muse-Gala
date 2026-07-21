"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Camera } from "lucide-react";

interface ReportIssueModalProps {
  open: boolean;
  setonOpenChange: (open: boolean) => void;
}

export default function ReportIssueModal({
  open,
  setonOpenChange,
}: ReportIssueModalProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    issueType: "",
    description: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, issueType: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", { ...formData, photo: photoFile });

    setFormData({ orderId: "", issueType: "", description: "" });
    setPhotoFile(null);
    setPhotoPreview(null);
    setonOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={setonOpenChange}>
      <DialogContent className="sm:max-w-md p-6 lg:max-w-6xl rounded-none border shadow-lg">
        <div className="w-full pt-10">
          <h1 className="text-center font-normal text-[32px] ">
            Report an Issue
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          <div className="space-y-1">
            <label htmlFor="orderId" className="text-sm flex items-center">
              Order ID <span className="text-[#891D33] ml-1">*</span>
            </label>
            <Input
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={handleInputChange}
              required
              className="border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 py-2"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="issueType" className="text-sm flex items-center">
              Issue Type <span className="text-[#891D33] ml-1">*</span>
            </label>
            <Select
              value={formData.issueType}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger className="border-0 border-b border-gray-300 rounded-none focus:ring-0 px-0 py-2">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item_not_received">
                  Item hasn&#39;t arrived
                </SelectItem>
                <SelectItem value="wrong_item">
                  Item is damaged or incorrect
                </SelectItem>
                <SelectItem value="damaged">Return issues</SelectItem>
                <SelectItem value="other">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm flex items-center">
              Optional Photo Upload{" "}
              <span className="text-[#891D33] ml-1">*</span>
            </label>
            <div className="border-b border-gray-300 pb-6">
              <div className="flex justify-center">
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {photoPreview ? (
                    <div className="relative w-20 h-20">
                      <Image
                        width={500}
                        height={500}
                        src={photoPreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-20  h-20 object-cover border border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 border border-gray-300 rounded flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="text-sm flex items-center">
              Description <span className="text-[#891D33] ml-1">*</span>
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="min-h-[100px] border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 px-0 py-2 resize-none"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="outline"
              className="border-black  hover:bg-gray-100 text-xs tracking-wider px-6 rounded-none"
            >
              SUBMIT ISSUE
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
