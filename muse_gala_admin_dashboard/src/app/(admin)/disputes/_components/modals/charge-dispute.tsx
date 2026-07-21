/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
    amount: z.coerce.number().min(1, "Amount must be at least 1."),
    reason: z.string().min(1, "Reason is required."),
});

type FormData = z.infer<typeof formSchema>;

interface ChargeDisputeProps {
    disputeId: string | null;
    token: string;
}

const ChargeDispute = ({ disputeId, token }: ChargeDisputeProps) => {
    const [formError, setFormError] = useState<string>("");
    const queryClient = useQueryClient();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            amount: undefined,
            reason: "",
        },
    });

    const chargeMutation = useMutation({
        mutationFn: async (data: FormData) => {
            if (!disputeId) return;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/${disputeId}/charge`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...data, disputeId }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Charge failed");
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("User charged successfully!");
            form.reset();
            setFormError("");
            queryClient.invalidateQueries({ queryKey: ["dispute-details", disputeId] });
        },
        onError: (error: Error) => {
            setFormError(error.message);
            toast.error(error.message || "Failed to charge user");
        },
    });

    const onSubmit = (data: FormData) => {
        setFormError("");
        chargeMutation.mutate(data);
    };

    return (
        <div className="mt-5">
            <h1 className="text-2xl font-medium mb-8">Charge User</h1>

            {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                    {formError}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Charge Amount *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="Enter charge amount"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reason for Charge *</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe why the user is being charged..."
                                        {...field}
                                        className="min-h-[100px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={chargeMutation.isPending}
                        className="w-full bg-slate-900 hover:bg-slate-800"
                    >
                        {chargeMutation.isPending ? "Processing..." : "Process Charge"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ChargeDispute;
