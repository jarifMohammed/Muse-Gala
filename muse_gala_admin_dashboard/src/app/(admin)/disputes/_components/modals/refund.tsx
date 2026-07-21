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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  disputeId: z.string().min(1, "Dispute ID is required."),
  refundType: z.enum(["full", "partial"]),
  amount: z.coerce.number().optional().nullable(),
  reason: z.string().min(1, "Reason is required."),
});

type FormData = z.infer<typeof formSchema>;

const Refund = () => {
  const [formError, setFormError] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      disputeId: "",
      refundType: undefined,
      amount: undefined,
      reason: "",
    },
  });

  const refundType = form.watch("refundType");

  const refundDispute = async (data: FormData) => {
    // Manual validation
    if (!data.refundType) {
      throw new Error("Please select a refund type.");
    }

    if (data.refundType === "partial" && (!data.amount || data.amount <= 0)) {
      throw new Error("Please enter a valid amount for partial refund.");
    }

    const requestBody: any = {
      disputeId: data.disputeId,
      reason: data.reason,
    };

    if (data.refundType === "partial" && data.amount) {
      requestBody.amount = data.amount;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/refund`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || "Refund failed");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: refundDispute,
    onSuccess: () => {
      toast.success("Refund processed successfully!");
      form.reset();
      setFormError("");
    },
    onError: (error: Error) => {
      const isUnpaidError = error.message.includes("payment_intent or charge");
      const displayMessage = isUnpaidError
        ? "This booking is not paid yet refund not possible"
        : error.message;

      setFormError(displayMessage);
      toast.error(displayMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    setFormError("");

    if (!data.refundType) {
      form.setError("refundType", {
        type: "manual",
        message: "Please select a refund type.",
      });
      return;
    }

    if (data.refundType === "partial") {
      if (!data.amount && data.amount !== 0) {
        form.setError("amount", {
          type: "manual",
          message: "Amount is required for partial refund",
        });
        return;
      }
      if (data.amount && data.amount <= 0) {
        form.setError("amount", {
          type: "manual",
          message: "Amount must be greater than 0",
        });
        return;
      }
    }

    mutation.mutate(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8">Refund</h1>

      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {formError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="disputeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispute ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter dispute ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="refundType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Refund Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select refund type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Refund</SelectItem>
                    <SelectItem value="partial">Partial Refund</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {refundType === "partial" && (
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refund Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Enter refund amount"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : parseFloat(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Refund *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reason for refund" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Processing..." : "Process Refund"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Refund;