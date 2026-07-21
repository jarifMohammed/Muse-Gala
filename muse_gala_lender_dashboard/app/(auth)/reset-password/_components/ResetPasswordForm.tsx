"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import AuthHeader from "@/components/shared/Auth/AuthHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { resetPasswordAction } from "@/actions/auth/reset-password";

// Password validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: PasswordFormValues) {
    if (!email) {
      toast.error("Email not found. Please restart the reset process.");
      return;
    }

    startTransition(() => {
      resetPasswordAction(email, values.password).then((res) => {
        if (!res.success) {
          toast.error(res.message || "Failed to reset password.");
          return;
        }
        toast.success(res.message || "Password reset successfully!");
        router.push("/sign-in");
      });
    });
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <AuthHeader
        title1="Reset"
        title2="Password"
        desc="Reset and remember your password"
      />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 p-4"
        >
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Lock className="w-6 h-6 text-[#999999]" />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      className="font-avenir w-full md:w-[400px] h-[40px] bg-transparent border-t-0 border-l-0 border-r-0 border-b border-black text-[12px] placeholder:text-[12px] placeholder:text-[#999999] placeholder:leading-[120%] placeholder:font-normal pl-[52px] pr-4 py-[15px] rounded-none focus-visible:ring-0 focus-visible:border-b-2"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />

          <div className="mt-6 mb-4">
            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Lock className="w-6 h-6 text-[#999999]" />
                      </div>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="font-avenir w-full md:w-[400px] h-[40px] bg-transparent border-t-0 border-l-0 border-r-0 border-b border-black text-[12px] placeholder:text-[12px] placeholder:text-[#999999] placeholder:leading-[120%] placeholder:font-normal pl-[52px] pr-4 py-[15px] rounded-none focus-visible:ring-0 focus-visible:border-b-2"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              variant="ghost"
              className="group p-0 h-auto hover:bg-transparent flex items-center gap-2"
              disabled={isPending}
            >
              <span className="font-avenir text-lg font-medium text-black">
                {isPending ? "Resetting" : ""}
              </span>
              <ArrowRight className="w-12 h-12 text-black group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
