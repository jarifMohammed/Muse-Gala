"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const decodeEmail = decodeURIComponent(email).toLowerCase();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // reset password api integration
  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (values: { email: string; newPassword: string }) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.status) {
        toast.error(data.message || "Something went wrong");
        return;
      }
      toast.success(data.message || "Password reset successfully");
      form.reset();

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (!decodeEmail) {
      toast.error("Email is required");
      return;
    }

    mutate({
      email: decodeEmail,
      newPassword: values.password,
    });
  }

  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px] md:gap-[40px] lg:gap-[60px] px-5 md:px-0">
        {/* left side image part */}
        <div className="md:col-span-3">
          <Image
            src="/images/auth.jpg"
            alt="reset-password"
            width={500}
            height={500}
            className="w-full h-[400px] md:h-[496px] object-cover"
          />
        </div>
        {/* form part */}
        <div className="md:col-span-2 md:pr-[50px] lg:pr-[100px]">
          <h2 className="text-2xl md:text-[27px] lg:text-3xl font-normal text-black leading-[36px] pb-[25px] md:pb-[35px] lg:pb-[45px] text-right">
            Create New Password
          </h2>
          <p className="text-base font-normal text-black mb-6 text-right">
            Your new password must be different from previously used passwords.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-black leading-[20px] uppercase">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder=""
                          {...field}
                          className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-black leading-[20px] uppercase">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder=""
                          {...field}
                          className="border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex justify-center items-center pt-[20px]">
                <button
                  disabled={isPending}
                  className="text-base font-normal text-black leading-[20px] border-b border-black py-[10px] uppercase"
                  type="submit"
                >
                  {isPending ? "Sending..." : "Reset Password"}
                </button>
              </div>
            </form>
          </Form>
          <div className="w-full flex justify-end items-center pt-[25px] md:pt-[45px] lg:pt-[60px]">
            <Link href="/login">
              <button
                className="text-base font-normal text-black leading-[20px] border-b border-black py-[10px] uppercase"
                type="button"
              >
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
