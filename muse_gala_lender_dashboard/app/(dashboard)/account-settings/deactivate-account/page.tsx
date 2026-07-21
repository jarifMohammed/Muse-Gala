import { auth } from "@/auth";
import React from "react";
import DeactivateForm from "./components/deactivate-form";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;
  const userID = cu?.user?.id;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-medium uppercase tracking-[0.3rem]">
        Deactivate Your Account
      </h1>

      <DeactivateForm token={token as string} />
    </div>
  );
};

export default page;
