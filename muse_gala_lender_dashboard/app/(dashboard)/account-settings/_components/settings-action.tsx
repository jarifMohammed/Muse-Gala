import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const SettingsAction = () => {
  return (
    <div>
      <Card className="p-4 md:p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
        <h1 className="text-lg md:text-xl font-medium text-gray-900 mb-6 uppercase tracking-wider">Actions</h1>

        <div className="flex items-center gap-5">
          <Link href={`/account-settings/deactivate-account`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#54051d] hover:bg-[#400416] text-white">Deactivate Account</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SettingsAction;
