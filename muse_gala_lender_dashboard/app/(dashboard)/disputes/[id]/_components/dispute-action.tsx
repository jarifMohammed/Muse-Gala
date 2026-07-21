"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DisputeForm() {
  const { id } = useParams();

  return (
    <div>
      <Card className="p-4 md:p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] mt-8 border-none">
        <h1 className="text-lg md:text-xl font-medium text-gray-900 mb-4 md:mb-6">Actions</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
          <Link href={`/disputes/${id}/escalate-dispute`} className="w-full md:w-auto">
            <Button className="w-full h-11 md:h-10 md:w-auto">Escalate Dispute</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
