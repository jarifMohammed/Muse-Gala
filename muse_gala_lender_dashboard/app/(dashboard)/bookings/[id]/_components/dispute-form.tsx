"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";

export default function DisputeForm() {
  const [disputeReason, setDisputeReason] = useState("Damaged Dress");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const params = useParams();
  const id = params.id;
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["submit-dispute"],
    mutationFn: async () => {
      if (!token) {
        throw new Error("You must be logged in to submit a dispute");
      }

      const formData = new FormData();
      formData.append("bookingId", id as string);
      formData.append("issueType", disputeReason);
      formData.append("description", description);
      if (selectedFile) {
        formData.append("filename", selectedFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit dispute");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Dispute submitted successfully");
      setDescription("");
      setSelectedFile(null);
      setFileName("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description of the issue");
      return;
    }

    try {
      await mutateAsync();
    } catch (error) {
      console.log(`error from submit dispute : ${error}`);
    }
  };

  return (
    <div className="">
      <Card className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
        <h1 className="text-xl font-medium text-gray-900 mb-6">
          Having an issue with this booking?
        </h1>

        <div className="space-y-6">
          {/* Dispute Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dispute Reason
            </label>
            <Select value={disputeReason} onValueChange={setDisputeReason}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Damaged Dress">Damaged Dress</SelectItem>
                <SelectItem value="Wrong Size">Wrong Size</SelectItem>
                <SelectItem value="Late Delivery">Late Delivery</SelectItem>
                <SelectItem value="Quality Issues">Quality Issues</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none bg-white font-normal"
              placeholder=""
              disabled={isPending}
            />
          </div>

          {/* File Upload */}
          <div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {fileName || "File name (Optional)"}
                </span>
                <Button onClick={handleFileUpload} disabled={isPending}>
                  Upload File
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>
          </div>

          {/* Note */}
          <p className="text-sm text-gray-600">
            Note: Disputes should only be submitted after the return due date or
            for urgent issues.
          </p>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Submitting</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
