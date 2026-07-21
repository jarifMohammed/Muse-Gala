"use client";

import type React from "react";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const OtpForm = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const decodeEmail = decodeURIComponent(email).toLowerCase();

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setIsError(false);

    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a number and has a reasonable length
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    const pastedChars = pastedData.split("").slice(0, 6);

    pastedChars.forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });

    setOtp(newOtp);
    setIsError(false);

    // Focus the next empty input or the last input if all are filled
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  // otp api integration
  const { mutate, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: (values: { otp: string; email: string }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.status) {
        toast.error(data.message || "Something went wrong");
        return;
      }
      toast.success(data.message || "OTP verified successfully");
      router.push(`/reset-password?email=${encodeURIComponent(decodeEmail)}`);
    },
  });

  // otp api integration
  const { mutate: forgotPasswordMutate, isPending: forgotPasswordPending } =
    useMutation({
      mutationKey: ["forgot-password"],
      mutationFn: (email: string) =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forget-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }).then((res) => res.json()),
      onSuccess: (data) => {
        if (!data.status) {
          toast.error(data.message || "Something went wrong");
          return;
        }
        toast.success(data.message || "Check your email for reset link");
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    // Check if OTP is complete
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    mutate({ otp: otpValue, email: decodeEmail });
  };

  const handleResendCode = () => {
    if (!decodeEmail) {
      toast.error("New verification code sent to your email");
      return;
    }

    forgotPasswordMutate(decodeEmail);
  };

  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[20px] md:gap-[40px] lg:gap-[60px] px-5 md:px-0">
        {/* left side image part */}
        <div className="md:col-span-3 h-[500px] md:h-[794px] w-full md:-mt-5 lg:-mt-10">
          <Image
            src="/pages/alreadyPartofMuse.webp"
            alt="otp-verification"
            width={1000}
            height={1000}
            quality={100}
            priority
            className="object-cover h-full w-full"
          />
        </div>
        {/* form part */}
        <div className="md:col-span-2 md:pr-[50px] lg:pr-[100px]">
          <h2 className="text-2xl md:text-[27px] lg:text-3xl font-normal text-black leading-[36px] pb-[25px] md:pb-[35px] lg:pb-[45px] text-right">
            Verify Your Otp
          </h2>
          <p className="text-base font-normal text-black mb-6 text-right">
            Enter the verification code sent to your email address.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 mb-8">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="w-full max-w-[60px]">
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-full aspect-square text-center text-xl font-medium border ${
                      isError ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:border-black focus:ring-0`}
                    aria-label={`Digit ${index + 1} of verification code`}
                  />
                </div>
              ))}
            </div>

            {isError && (
              <p className="text-red-500 text-sm mb-4 text-center">
                Incorrect verification code. Please try again.
              </p>
            )}

            <div className="w-full flex justify-center items-center pt-[20px]">
              <button
                disabled={isPending}
                className="text-base font-normal text-black leading-[20px] border-b border-black py-[10px] uppercase"
                type="submit"
              >
                {isPending ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </form>

          <div className="w-full flex justify-between items-center pt-[25px] md:pt-[45px] lg:pt-[60px]">
            <button
              disabled={forgotPasswordPending}
              className="text-base font-normal text-black leading-[20px] border-b border-black py-[10px] uppercase"
              type="button"
              onClick={handleResendCode}
            >
              {forgotPasswordPending ? "Resending..." : "Resend Code"}
            </button>
            <Link href="/forgot-password">
              <button
                className="text-base font-normal text-black leading-[20px] border-b border-black py-[10px] uppercase"
                type="button"
              >
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;
