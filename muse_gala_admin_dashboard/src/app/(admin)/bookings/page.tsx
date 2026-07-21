import React from "react";
import { auth } from "@/auth";
import Bookings from "./_components/bookings";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;

  return (
    <div>
      <Bookings token={token as string } />
    </div>
  );
};

export default page;
