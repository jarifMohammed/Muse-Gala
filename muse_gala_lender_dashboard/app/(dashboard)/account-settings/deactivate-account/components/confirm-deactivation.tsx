"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

type FormValue = z.input<typeof formSchema>;

interface ConfirmDeactivationPayload {
  email: string;
}

const ConfirmDeactivation = ({ token }: { token: string }) => {
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["confirm-deactivation"],
    mutationFn: async (payload: ConfirmDeactivationPayload) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/deactivate/send-code`,
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
        throw new Error("Failed to confirm deactivation");
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
      console.log(`error from confirm deactivation : ${error}`);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
      <h1 className="text-xl font-medium mb-5">Send Deactivation Code</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-red-700">Enter Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                    className="h-[50px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            {isPending ? "Sending Deactivation Code" : "Send Deactivation Code"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default ConfirmDeactivation;
