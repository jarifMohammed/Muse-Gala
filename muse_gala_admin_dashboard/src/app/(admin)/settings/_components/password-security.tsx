"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const PasswordSecurity = ({
  token,
}: {
  token: string;
  userID: string;
}) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const updateUserInfo = useMutation({
    mutationKey: ["update-user-info"],
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: oldPass,
            newPassword: newPass,
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
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast.error("Password do not match");
      return;
    }

    if (!oldPass || !newPass) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateUserInfo.mutate();
  };

  return (
    <div className="p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg">
      <h1 className="text-xl ">Password & Security</h1>

      <form onSubmit={handleSubmit}>
        <div className="mt-5 grid grid-cols-2 items-center gap-8">
          <div>
            <h1 className="mb-2">Current Password</h1>
            <Input
              className="focus-visible:ring-0"
              placeholder="Enter Current Password"
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>

          <div></div>

          <div>
            <h1 className="mb-2">New Password</h1>
            <Input
              className="focus-visible:ring-0"
              placeholder="Enter New Password"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>

          <div>
            <h1 className="mb-2">Confirm New Password</h1>
            <Input
              className="focus-visible:ring-0"
              placeholder="Confirm New Password"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
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
    </div>
  );
};

export default PasswordSecurity;
