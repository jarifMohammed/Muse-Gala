"use client";

import React from "react";
import ContactInformation from "./contact-information";
import PasswordSecurity from "./password-security";
import NotificationPreference from "./notification-preference";
import { useQuery } from "@tanstack/react-query";

interface Props {
  token: string;
  userID: string;
}

const SettingContainer = ({ token, userID }: Props) => {
  const { data: userInfo = {} } = useQuery({
    queryKey: ["user-info"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${userID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data.data;
    },
  });

  return (
    <div className="mt-8 space-y-8">
      <ContactInformation userInfo={userInfo} token={token} userID={userID} />
      <PasswordSecurity token={token} userID={userID} />
      <NotificationPreference />
    </div>
  );
};

export default SettingContainer;
