"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ApiProps {
  status: boolean;
  message: string;
}

// 1. Define Zod schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

// 2. Type for form data
type EmailFormData = z.infer<typeof emailSchema>;

export default function EmailForm() {
  // 3. Initialize React Hook Form
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["marketing"],
    mutationFn: (email: string) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/newsletterSubscription/create`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      ).then((res) => res.json()),
    onSuccess(data: ApiProps) {
      if (!data.status) {
        toast.error(data.message);
        return;
      }

      // handle succeess
      toast.success("You’re officially on the list — elegance is coming.");
      form.reset({
        email: "",
      });
    },
  });

  const onSubmit = (data: EmailFormData) => {
    mutate(data.email);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  max-w-[500px]">
        <div className="flex items-center border-b-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-full border-0 inset-0 focus-visible:ring-0  outline-none shadow-none"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
