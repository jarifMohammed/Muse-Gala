import React from "react";
import SubscriptionPlanDetails from "./_components/SubscriptionPlanDetails";
import { auth } from "@/auth";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;

  return (
    <div className="p-10">
      <SubscriptionPlanDetails token={token as string} />
    </div>
  );
};

export default page;
