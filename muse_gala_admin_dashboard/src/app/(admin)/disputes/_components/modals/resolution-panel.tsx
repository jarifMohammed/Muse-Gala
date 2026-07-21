import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

interface ResolutionPanelProps {
    disputeId: string | null;
    token: string;
}

const ResolutionPanel = ({ disputeId, token }: ResolutionPanelProps) => {
    const [message, setMessage] = useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!disputeId) return;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/${disputeId}/resolve`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        message,
                    }),
                }
            );

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to resolve dispute");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Dispute resolved successfully!");
            setMessage("");
            queryClient.invalidateQueries({ queryKey: ["dispute-details", disputeId] });
            queryClient.invalidateQueries({ queryKey: ["all-disputes"] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const handleResolve = () => {
        if (!message.trim()) {
            toast.error("Please enter a resolution message");
            return;
        }
        mutation.mutate();
    };

    return (
        <div className="mt-5 space-y-6">
            <div className="border border-gray-200 p-6 rounded-lg shadow-sm">
                <h1 className="text-xl font-semibold mb-6 text-slate-900">Final Resolution</h1>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Resolution Message</label>
                        <Textarea
                            placeholder="Type the final resolution message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[150px] focus-visible:ring-green-600 rounded-xl resize-none border-slate-200"
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            onClick={handleResolve}
                            disabled={mutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-xl h-11 transition-all active:scale-95"
                        >
                            {mutation.isPending ? "Resolving..." : "Resolve Dispute"}
                        </Button>
                        <span className="text-[10px] items-center gap-1 text-slate-400 font-medium">
                            * This will permanently close the dispute and notify both parties.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResolutionPanel;
