import React from "react";
import FinanceHeader from "./finance-header";
import { auth } from "@/auth";

const Finance = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;

  return (
    <div>
      <FinanceHeader token={token as string} />
    </div>
  );
};

export default Finance;
