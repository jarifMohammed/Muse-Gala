"use client";

import React from "react";
import ContactInformation from "./contact-information";
import LocationSettings from "./location-settings";
import PasswordSecurity from "./password-security";
import PaymentMethods from "./payment-methods";
import PayoutSettings from "./payout-settings";
import ReturnAddressSettings from "./return-address-settings";
import { useQuery } from "@tanstack/react-query";
import SettingsAction from "./settings-action";

interface Props {
  token: string;
  userID: string;
}

const SettingContainer = ({ token, userID }: Props) => {
  const { data: userInfo = {} } = useQuery({
    queryKey: ["user-info", userID],
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
      return data;
    },
  });

  return (
    <div className="mt-8 space-y-8 pb-10">
      <ContactInformation userInfo={userInfo} token={token} userID={userID} />
      <LocationSettings userInfo={userInfo} token={token} userID={userID} />
      <ReturnAddressSettings userInfo={userInfo} token={token} userID={userID} />
      <PaymentMethods userInfo={userInfo} token={token} userID={userID} />
      <PayoutSettings userInfo={userInfo} token={token} userID={userID} />
      <PasswordSecurity token={token} userID={userID} />
      {/* <NotificationPreference /> */}
      <SettingsAction />
    </div>
  );
};

export default SettingContainer;
