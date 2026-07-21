"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthHeader from "@/components/shared/Auth/AuthHeader";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpAction } from "@/actions/auth/verify-otp";
import { forgotPasswordAction } from "@/actions/auth/forgot-password";

export default function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only take the first character

    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a valid 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please go back and try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordAction(email);
      if (!res.success) {
        toast.error(res.message || "Failed to resend OTP.");
      } else {
        toast.success("OTP resent successfully!");
        setOtp(Array(6).fill(""));
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    // Check if OTP is complete
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please go back and try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtpAction(email, otpValue);
      if (!res.success) {
        toast.error(res.message || "Invalid OTP. Please try again.");
      } else {
        toast.success(res.message || "OTP verified successfully.");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      <AuthHeader
        title1="Enter"
        title2="OTP"
        desc={email ? `OTP sent to ${email}` : "Enter your OTP below"}
      />

      <div className="py-6 md:py-7 lg:py-8 px-4 md:px-5 lg:px-6 w-full">
        {/* OTP Input Fields */}
        <div className="flex gap-[18px] w-full justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`font-avenir w-[52px] h-[58px] bg-transparent text-black text-center text-2xl font-medium leading-[120%] border-t-0 border-l-0 border-r-0 border-b border-black rounded-none focus:outline-none focus-visible:ring-0 focus-visible:border-b-2 transition-colors ${digit ? "border-[#891D33] border-b-2" : "border-black"
                }`}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Resend OTP */}
        <div className="text-center my-6">
          <span className="font-avenirNormal text-xl font-normal leading-[120%] text-[#ACACAC] tracking-[0%]">Didn&apos;t Receive OTP? </span>
          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="font-avenirNormal text-xl font-normal leading-[120%] text-black tracking-[0%] hover:underline"
          >
            RESEND OTP
          </button>
        </div>

        {/* Verify Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleVerify}
            disabled={loading}
            variant="ghost"
            className="group p-0 h-auto hover:bg-transparent flex items-center gap-2"
          >
            <span className="font-avenir text-lg font-medium text-black">
              {loading ? "Verifying" : ""}
            </span>
            <ArrowRight className="w-12 h-12 text-black group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
