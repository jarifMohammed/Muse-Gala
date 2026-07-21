import React from "react";
import { auth } from "@/auth";
import ReturnManagement from "./_components/ReturnManagement";

const Page = async () => {
    const cu = await auth();
    const token = cu?.user.accessToken;

    return (
        <div className="p-6">
            <ReturnManagement token={token as string} />
        </div>
    );
};

export default Page;
