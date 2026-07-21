import React from "react";
import BookingsDetails from "./_components/BookingsDetails";
import { auth } from "@/auth";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;

  return (
    <div className="p-10">
      <BookingsDetails token={token as string} />
    </div>
  );
};

export default page;
