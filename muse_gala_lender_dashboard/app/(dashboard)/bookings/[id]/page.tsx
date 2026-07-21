import React from "react";
import BookingsDetails from "./_components/BookingsDetails";
import { auth } from "@/auth";

const page = async () => {
  const cu = await auth();

  const token = cu?.user.accessToken;
  const id = cu?.user.id;

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <BookingsDetails token={token as string} userID={id as string} />
    </div>
  );
};

export default page;
