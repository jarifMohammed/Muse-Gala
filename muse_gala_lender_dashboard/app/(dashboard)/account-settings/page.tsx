import React from "react";
import SettingContainer from "./_components/settings-container";
import { auth } from "@/auth";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;
  const userID = cu?.user?.id;

  return (
    <div className="p-4 md:p-10">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-[#54051d] transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Overview
        </Link>
      </div>

      <h1 className="text-xl md:text-2xl font-medium uppercase tracking-[0.2rem] md:tracking-[0.3rem]">
        Account Settings{" "}
      </h1>

      <SettingContainer token={token as string} userID={userID as string} />
    </div>
  );
};

export default page;
