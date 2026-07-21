"use client";
import { loginAction } from "@/actions/auth/login";
import AuthHeader from "@/components/shared/Auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginformSchema, LoginFormValues } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginformSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form submission handler
  async function onSubmit(values: LoginFormValues) {
    startTransition(() => {
      loginAction(values).then((res) => {
        if (!res.success) {
          toast.error(res.message || "Login failed. Please try again.");
          return;
        }

        toast.success(res.message || "Login successful");

        const targetUrl = "/bookings";

        // Use window.location.href instead of router.push to force a hard reset
        // This ensures the SessionProvider fetches the newly set authentication cookies!
        window.location.href = targetUrl;
      });
    });
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <AuthHeader
        title1="MUSE"
        title2="GALA"
        desc="THE LENDER SUITE"
      />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full py-6 md:py-7 lg:py-8 px-4 md:px-5 lg:px-6"
        >
          {/* Email Field */}
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
                      placeholder="Enter Your Email"
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

          {/* Password Field */}
          <div className="mt-6 mb-4">
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
                        placeholder="Enter Your Password"
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
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between mb-6 md:mb-7 lg:mb-8">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      className="w-4 h-4 border border-black rounded-[2px]"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="rememberMe"
                    />
                  </FormControl>
                  <Label
                    htmlFor="rememberMe"
                    className="font-avenir text-[12px] font-normal text-black leading-[120%] tracking-[0%] cursor-pointer"
                  >
                    Remember me
                  </Label>
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="font-avenir text-[12px] text-[#891D33] font-normal leading-[120%] tracking-[0%] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="flex justify-end mt-8">
            <Button
              type="submit"
              variant="ghost"
              className="group p-0 h-auto hover:bg-transparent"
              disabled={isPending}
            >
              <span className="sr-only">Sign In</span>
              <ArrowRight className="w-12 h-12 text-black group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Sign Up Link */}
          {/* <div className="text-center text-sm mt-4 md:mt-5 lg:mt-6">
            <span className="font-poppins text-[#891D33] text-xs font-normal leading-[120%] tracking-[0%]">
              New To our Platform?
            </span>{" "}
            <Link
              href="/signup"
              className="font-poppins text-black text-xs leading-[120%] font-medium hover:underline"
            >
              Sign Up Here
            </Link>
          </div> */}
        </form>
      </Form>
    </div>
  );
}
