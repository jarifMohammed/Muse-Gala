import React from "react";
import Disputes from "./_components/dispute";
import { auth } from "@/auth";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;

  return (
    <div className=" mx-auto container pb-20">
      <Disputes token={token as string} />
    </div>
  );
};

export default page;
