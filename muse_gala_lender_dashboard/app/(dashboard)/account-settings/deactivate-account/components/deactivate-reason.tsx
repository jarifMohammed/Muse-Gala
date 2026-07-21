import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  reason: z.string().min(1, {
    message: "Reason is required",
  }),
  feedback: z.string().min(1, {
    message: "Feedback is required",
  }),
});

type FormValue = z.input<typeof formSchema>;

type DeactivationPayload = {
  reason: string;
  feedback: string;
};

const DeactivateReason = ({ token }: { token: string }) => {
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      feedback: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["start-deactivation"],
    mutationFn: async (payload: DeactivationPayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/deactivate/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to start deactivation");
      }

      return await res.json();
    },
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  const onSubmit = async (value: FormValue) => {
    try {
      await mutateAsync(value);
    } catch (error) {
      console.log(`error from start deactivation : ${error}`);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
      <h1 className="text-xl font-medium mb-5">Reason for Deactivation</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-red-700">
                  Why are you deactivating? *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write your reason"
                    {...field}
                    className="h-[50px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-red-700">
                  Additional Feedback (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., "
                    {...field}
                    className="h-[150px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            {isPending ? "Starting Deactivation" : "Start Deactivation"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default DeactivateReason;
