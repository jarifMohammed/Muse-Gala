"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/schemas/auth";

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
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      ).then((res) => res.json()),
    onSuccess: (data, email) => {
      if (!data.status) {
        toast.error(data.message || "Something went wrong");
        return;
      }
      toast.success(data.message || "Check your email for reset link");
      form.reset();
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    console.log(values);
    mutate(values.email);
  }

  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px] md:gap-[40px] lg:gap-[60px] px-5 md:px-0">
        {/* left side image part */}
        <div className="md:col-span-3">
          <Image
            src="/pages/alreadyPartofMuse.webp"
            alt="forgot-password"
            width={1000}
            height={1000}
            quality={100}
            priority
            className="w-full h-[500px] md:h-[794px] object-cover"
          />
        </div>
        {/* form part */}
        <div className="md:col-span-2 md:pr-[50px] lg:pr-[100px]">
          <h2 className="text-2xl md:text-[27px] lg:text-3xl font-normal text-black leading-[36px] pb-[25px] md:pb-[35px] lg:pb-[45px] text-right">
            Forgot Your Password?
          </h2>
          <p className="text-base font-normal text-black mb-6 text-right">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-black leading-[20px] uppercase">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toLowerCase())}
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
                  {isPending ? "Sending..." : "Send OTP"}
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

export default ForgotPasswordForm;
