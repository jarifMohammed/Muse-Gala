import React from "react";
import { auth } from "@/auth";
import PaymentFilter from "./_components/payment-filter";
import PaymentHeader from "./_components/payment-header";
import PaymentsTable from "./_components/payments-table";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-8">
      <PaymentHeader token={token as string} id={cu?.user?.id as string} />
      <PaymentFilter />
      <PaymentsTable token={token as string} />
    </div>
  );
};

export default page;
