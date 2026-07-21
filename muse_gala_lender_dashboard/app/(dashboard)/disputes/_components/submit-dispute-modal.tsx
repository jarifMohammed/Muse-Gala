"use client";

import type React from "react";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

interface SubmitDisputeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DisputeFormData {
  bookingId: string;
  issueType: string;
  description: string;
  filename: File | null;
}

interface ApiDisputeData {
  bookingId: string;
  issueType: string;
  description: string;
  filename: string;
}

export function SubmitDisputeModal({
  open,
  onOpenChange,
}: SubmitDisputeModalProps) {
  const [bookingId, setBookingId] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  // Reset form when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form state when closing
      setBookingId("");
      setReason("");
      setDescription("");
      setFile(null);
      setFileName("");
    }
    onOpenChange(open);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // TanStack Query mutation for submitting dispute
  const submitDisputeMutation = useMutation({
    mutationFn: async (formData: DisputeFormData) => {
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create FormData for file upload
      const apiFormData = new FormData();
      apiFormData.append("bookingId", formData.bookingId);
      apiFormData.append("issueType", formData.issueType);
      apiFormData.append("description", formData.description);

      if (formData.filename) {
        apiFormData.append("filename", formData.filename);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: apiFormData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Failed to submit dispute: ${response.status}`
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Dispute submitted successfully!");
      handleOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to submit dispute. Please try again."
      );
    },
  });

  const handleSubmit = () => {
    // Validation
    if (!bookingId.trim()) {
      toast.error("Please enter a Booking ID");
      return;
    }

    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (submitDisputeMutation.isPending) return;

    if (submitDisputeMutation.isPending) return;

    const formData: DisputeFormData = {
      bookingId: bookingId.trim(),
      issueType: reason,
      description: description.trim(),
      filename: file,
    };

    submitDisputeMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[700px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-normal text-foreground">
              Submit New Dispute
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* Booking ID */}
          <div className="space-y-2">
            <Label
              htmlFor="booking-id"
              className="text-sm font-normal text-foreground"
            >
              Booking ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="booking-id"
              placeholder="Enter Booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              disabled={submitDisputeMutation.isPending}
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="text-sm font-normal text-foreground"
            >
              Reason <span className="text-red-500">*</span>
            </Label>
            <Select
              value={reason}
              onValueChange={setReason}
              disabled={submitDisputeMutation.isPending}
            >
              <SelectTrigger
                id="reason"
                className="w-full bg-background border-input"
              >
                <SelectValue placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Item hasn't arrived">
                  Item hasn't arrived
                </SelectItem>
                <SelectItem value="Item is damaged or incorrect">
                  Item is damaged or incorrect
                </SelectItem>
                <SelectItem value="Return issues">Return issues</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-normal text-foreground"
            >
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-background border-input resize-none"
              placeholder=""
              disabled={submitDisputeMutation.isPending}
            />
          </div>

          {/* Upload Evidence */}
          <div className="space-y-2">
            <Label
              htmlFor="file-upload"
              className="text-sm font-normal text-foreground"
            >
              Upload Evidence (Optional)
            </Label>
            <div className="flex">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={fileName}
                  placeholder="File name"
                  readOnly
                  className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-l-md text-muted-foreground focus-visible:ring-0 outline-none"
                />
              </div>
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={submitDisputeMutation.isPending}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  className="bg-[#7C2D3A] hover:bg-[#6B2532] text-white h-10 px-6 rounded-none rounded-r-md cursor-pointer disabled:opacity-50"
                  disabled={submitDisputeMutation.isPending}
                >
                  Upload File
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="px-8 h-10 border-input text-foreground hover:bg-accent"
              disabled={submitDisputeMutation.isPending}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-[#7C2D3A] hover:bg-[#6B2532] text-white px-6 h-10 disabled:opacity-50"
              disabled={submitDisputeMutation.isPending}
            >
              {submitDisputeMutation.isPending
                ? "Submitting"
                : "Submit Dispute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
