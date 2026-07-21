import React from "react";
import { auth } from "@/auth";
import DisputesDetails from "./_components/disputes-details";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;

  return (
    <div className="p-4 md:p-10">
      <DisputesDetails token={token as string} />
    </div>
  );
};

export default page;
