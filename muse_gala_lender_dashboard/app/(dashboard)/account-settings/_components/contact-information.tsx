/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useSettingStore } from "./states/useSettingStore";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type UserInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  businessAddress?: string;
};

const ContactInformation = ({
  userInfo = {} as UserInfo,
  token,
  userID,
}: {
  userInfo?: UserInfo;
  token: string;
  userID: string;
}) => {
  const {
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
  } = useSettingStore();
  const queryClient = useQueryClient();

  // Email Update State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailStep, setEmailStep] = useState<"request" | "verify">("request");

  const getProfileData = (userData: any) => {
    if (userData?.data?.user) return userData.data.user;
    if (userData?.user) return userData.user;
    if (userData?.data) return userData.data;
    return userData;
  };

  useEffect(() => {
    const profile = getProfileData(userInfo);
    const fname = profile?.firstName || "";
    const lname = profile?.lastName || "";
    const combined = `${fname} ${lname}`.trim();
    const nameToSet = profile?.fullName || profile?.fullname || combined;
    if (nameToSet) setFullName(nameToSet);
    if (profile?.phoneNumber) setPhoneNumber(profile.phoneNumber);
  }, [userInfo, setFullName, setPhoneNumber]);

  const updateUserInfo = useMutation({
    mutationKey: ["update-user-info"],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName,
            phoneNumber,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update user info");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user-info", userID] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const requestEmailUpdate = useMutation({
    mutationKey: ["request-email-update"],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/request-email-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newEmail }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request email update");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent to your new email address");
      setEmailStep("verify");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const confirmEmailUpdate = useMutation({
    mutationKey: ["confirm-email-update"],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/confirm-email-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to confirm email update");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Email updated successfully");
      setIsEmailModalOpen(false);
      setNewEmail("");
      setOtp("");
      setEmailStep("request");
      queryClient.invalidateQueries({ queryKey: ["user-info", userID] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserInfo.mutate();
  };

  return (
    <div className="p-4 md:p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg">
      <h1 className="text-lg md:text-xl font-medium">Contact Information</h1>

      <form onSubmit={handleSubmit}>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-8">
          <div>
            <label htmlFor="full-name" className="block mb-2">Full Name</label>
            <Input
              id="full-name"
              className="focus-visible:ring-0"
              placeholder="Enter Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="phone-number" className="block mb-2">Phone Number</label>
            <Input
              id="phone-number"
              className="focus-visible:ring-0"
              placeholder="Enter Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>


          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="email-display">Email</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEmailModalOpen(true)}
                className="text-xs h-6 text-[#891D33] hover:text-[#a0243d] hover:bg-[#891D33]/10"
              >
                Change Email
              </Button>
            </div>
            <Input
              id="email-display"
              disabled
              className="focus-visible:ring-0"
              placeholder="Enter Email Address"
              value={getProfileData(userInfo)?.email?.toLowerCase()}
            />
          </div>

          <div>
            <label htmlFor="postal-address" className="block mb-2">Postal Address</label>
            <Input
              id="postal-address"
              disabled
              className="focus-visible:ring-0"
              placeholder="No business address provided"
              value={getProfileData(userInfo)?.businessAddress}
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            disabled={updateUserInfo.isPending}
            type="submit"
            className="disabled:cursor-not-allowed"
          >
            {updateUserInfo.isPending ? (
              <h1 className="flex items-center gap-2">
                <LoaderCircle className="animate-spin h-6 w-6" />
                Save Changes
              </h1>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>

      {/* Email Update Modal */}
      <Dialog open={isEmailModalOpen} onOpenChange={(open) => {
        setIsEmailModalOpen(open);
        if (!open) {
          setNewEmail("");
          setOtp("");
          setEmailStep("request");
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{emailStep === "request" ? "Change Email Address" : "Verify OTP"}</DialogTitle>
            <DialogDescription>
              {emailStep === "request" 
                ? "Enter the new email address you'd like to use. We'll send an OTP to verify it." 
                : `We've sent a 6-digit code to ${newEmail}. Please enter it below.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {emailStep === "request" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">New Email Address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value.toLowerCase())}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <label className="text-sm font-medium w-full">Verification Code</label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button 
                  variant="link" 
                  className="text-xs text-muted-foreground"
                  onClick={() => requestEmailUpdate.mutate()}
                  disabled={requestEmailUpdate.isPending}
                >
                  Didn't receive a code? Resend
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmailModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (emailStep === "request") {
                  if (!newEmail) return toast.error("Please enter a new email");
                  requestEmailUpdate.mutate();
                } else {
                  if (otp.length !== 6) return toast.error("Please enter the 6-digit OTP");
                  confirmEmailUpdate.mutate();
                }
              }}
              disabled={requestEmailUpdate.isPending || confirmEmailUpdate.isPending}
              className="bg-[#891D33] hover:bg-[#a0243d] text-white"
            >
              {(requestEmailUpdate.isPending || confirmEmailUpdate.isPending) && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              {emailStep === "request" ? "Send OTP" : "Verify & Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactInformation;
