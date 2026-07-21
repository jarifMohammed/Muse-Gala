import React from "react";
import { auth } from "@/auth";
import SubscriptionTable from "./_components/subscription-table";
import SubscriptionHeader from "./_components/subscription-header";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;
  const id = cu?.user?.id;

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8">
      <SubscriptionHeader token={token as string} id={id as string} />
      <SubscriptionTable token={token as string} id={id as string} />
    </div>
  );
};

export default page;
