import React from "react";
import SettingContainer from "./_components/settings-container";
import { auth } from "@/auth";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;
  const userID = cu?.user?.id;

  return (
    <div>
      <h1 className="text-2xl font-medium uppercase tracking-[0.3rem]">
        Account Settings{" "}
      </h1>

      <SettingContainer token={token as string} userID={userID as string} />
    </div>
  );
};

export default page;
