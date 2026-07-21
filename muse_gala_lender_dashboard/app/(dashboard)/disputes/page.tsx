import React from "react";
import { auth } from "@/auth";
import DisputeHeader from "./_components/disputes-header";
import DisputesTable from "./_components/disputes-table";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const page = async () => {
  const cu = await auth();
  const token = cu?.user?.accessToken;

  return (
    <div className="p-4 md:p-10 space-y-6 md:space-y-8">
      <div>
        <Link
          href="/bookings"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-[#54051d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Bookings
        </Link>
      </div>
      <DisputeHeader token={token as string} />
      <DisputesTable token={token as string} />
    </div>
  );
};

export default page;
