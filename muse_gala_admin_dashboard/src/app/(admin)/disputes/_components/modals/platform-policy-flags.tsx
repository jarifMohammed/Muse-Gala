import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

interface PlatformPolicyFlagsProps {
  disputeId: string | null;
  token: string;
}

const PlatformPolicyFlags = ({ disputeId, token }: PlatformPolicyFlagsProps) => {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!disputeId) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/${disputeId}/response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
            status: "In Review",
          }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit response");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Response submitted successfully!");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["dispute-details", disputeId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mt-5 space-y-6">
      <div className="border border-gray-200 p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold mb-6 text-slate-900">Admin Response</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Message to Parties</label>
            <Textarea
              placeholder="Type your response to the customer/lender..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] focus-visible:ring-slate-900 rounded-xl resize-none border-slate-200"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 rounded-xl h-11 transition-all active:scale-95"
            >
              {mutation.isPending ? "Submitting..." : "Submit Response"}
            </Button>
            <span className="text-[10px] items-center gap-1 text-slate-400 font-medium">
              * Status will be automatically set to <span className="text-slate-900 font-bold underline decoration-slate-200 underline-offset-4">In Review</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformPolicyFlags;
