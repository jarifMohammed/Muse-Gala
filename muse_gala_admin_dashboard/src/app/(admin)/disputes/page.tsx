import React from "react";
import DisputesHeader from "./_components/DisputesHeader";
import SearchDisputes from "./_components/search-disputes";
import DisputesTable from "./_components/disputes-table";
import { auth } from "@/auth";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;

  return (
    <div>
      <DisputesHeader token={token as string} />
      <SearchDisputes />
      <DisputesTable token={token as string} />
    </div>
  );
};

export default page;
