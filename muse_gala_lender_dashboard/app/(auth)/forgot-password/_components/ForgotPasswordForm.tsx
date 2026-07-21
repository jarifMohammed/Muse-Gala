"use client";

import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import AuthHeader from "@/components/shared/Auth/AuthHeader";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { forgotPasswordAction } from "@/actions/auth/forgot-password";

// Define form schema with Zod
const formSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  function onSubmit(values: FormValues) {
    startTransition(() => {
      forgotPasswordAction(values.email).then((res) => {
        if (!res.success) {
          toast.error(res.message || "Failed to send OTP.");
          return;
        }
        toast.success(res.message || "OTP sent to your email.");
        router.push(`/otp?email=${encodeURIComponent(values.email)}`);
      });
    });
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <AuthHeader
        title1="Reset"
        title2="Password"
        desc="Enter your email to receive the OTP"
      />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full py-6 md:py-7 lg:py-8 px-4 md:px-5 lg:px-6"
        >
          {/* Email Field */}
          <div className="mb-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Mail className="w-6 h-6 text-[#999999]" />
                      </div>
                      <Input
                        placeholder="Enter your email"
                        className="font-avenir w-full md:w-[400px] h-[40px] bg-transparent border-t-0 border-l-0 border-r-0 border-b border-black text-[12px] placeholder:text-[12px] placeholder:text-[#999999] placeholder:leading-[120%] placeholder:font-normal pl-[52px] pr-4 py-[15px] rounded-none focus-visible:ring-0 focus-visible:border-b-2"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Send OTP Button */}
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              variant="ghost"
              disabled={isPending}
              className="group p-0 h-auto hover:bg-transparent flex items-center gap-2"
            >
              <span className="font-avenir text-lg font-medium  text-black">
                {isPending ? "Sending" : ""}
              </span>
              <ArrowRight className="w-8 h-8 text-black group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
