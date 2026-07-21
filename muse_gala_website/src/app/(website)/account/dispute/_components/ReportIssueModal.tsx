"use client";

import type React from "react";
import { useState } from "react";
import { Camera } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const [orderId, setOrderId] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const session = useSession();
  const token = session?.data?.user?.accessToken;
  const queryClient = useQueryClient();

  // Mutation for reporting issue
  const reportIssueMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/disputes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        try {
          result = JSON.parse(text);
        } catch {
          result = { message: text || "Unknown response" };
        }
      }

      if (!response.ok) {
        const errorMessage =
          result?.error ||
          result?.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-disputes"] });
      
      toast.success("Issue reported successfully!", {
        description: "Your issue has been submitted and will be reviewed shortly.",
      });

      // Reset form and close modal on success
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      console.error("Error reporting issue:", error);
      toast.error("Failed to report issue", {
        description: error.message,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication required", {
        description: "Please log in to report an issue",
      });
      return;
    }

    const formData = new FormData();
    formData.append("bookingId", orderId);
    formData.append("issueType", issueType);
    formData.append("description", description);

    if (photo) {
      formData.append("filename", photo);
    }

    reportIssueMutation.mutate(formData);
  };

  const resetForm = () => {
    setOrderId("");
    setIssueType("");
    setDescription("");
    setPhoto(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB",
        });
        return;
      }

      setPhoto(file);
      toast.success("Photo uploaded", {
        description: "Photo added successfully",
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const removePhoto = () => {
    setPhoto(null);
    toast.info("Photo removed");
  };

  const isSubmitting = reportIssueMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-0 p-12 shadow-lg">
        {/* Title */}
        <h2 className="mb-12 text-center font-avenir text-sm font-light tracking-widest text-gray-800">
          {"REPORT AN ISSUE"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Order ID */}
          <div>
            <label className="mb-2 block font-avenir text-xs font-light tracking-widest text-gray-600">
              {"Order ID"} <span className="text-red-400">{"*"}</span>
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 font-avenir text-sm font-light tracking-widest text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Issue Type */}
          <div>
            <label className="mb-2 block font-avenir text-xs font-light tracking-widest text-gray-600">
              {"Issue Type"} <span className="text-red-400">{"*"}</span>
            </label>
            <div className="relative">
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full appearance-none border-0 border-b border-gray-300 bg-transparent px-0 py-2 font-avenir text-sm font-light tracking-widest text-gray-600 focus:border-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50"
                required
                disabled={isSubmitting}
              >
                <option value="">{"Please Select"}</option>
                <option value="Item hasn't arrived">
                  {"Item hasn't arrived"}
                </option>
                <option value="Item is damaged or incorrect">
                  {"Item is damaged or incorrect"}
                </option>
                <option value="Return issues">{"Return issues"}</option>
                <option value="Others">{"Others"}</option>
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  strokeWidth={1}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Optional Photo Upload */}
          <div>
            <label className="mb-2 block font-avenir text-xs font-light tracking-widest text-gray-600">
              {"Optional Photo Upload"}
            </label>
            <label
              htmlFor="photo-upload"
              className={`flex cursor-pointer items-center justify-center border-b border-gray-300 py-16 transition-colors hover:border-gray-400 ${
                isSubmitting ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <Camera className="h-16 w-16 text-gray-300" strokeWidth={1} />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
                disabled={isSubmitting}
              />
            </label>
            {photo && (
              <div className="mt-2 flex items-center justify-between">
                <p className="font-avenir text-xs font-light tracking-widest text-gray-600">
                  {photo.name}
                </p>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="font-avenir text-xs font-light tracking-widest text-red-400 hover:text-red-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-avenir text-xs font-light tracking-widest text-gray-600">
              {"Description"} <span className="text-red-400">{"*"}</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none border-0 border-b border-gray-300 bg-transparent px-0 py-2 font-avenir text-sm font-light tracking-widest text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="border-b border-gray-800 pb-1 font-avenir text-xs font-light tracking-widest text-gray-800 transition-colors hover:border-gray-600 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT ISSUE"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}