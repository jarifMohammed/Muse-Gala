"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import AboutDisputes from "../_components/about-dispute";
import EscalateForm from "./_components/escalate-form";

const page = () => {
  const router = useRouter();
  const { id } = useParams();
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const { data: disputesDetails = {}, isLoading } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/disputes/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      return json.data;
    },
    enabled: !!token,
  });

  return (
    <div className="p-4 md:p-10">
      <div className="mb-4">
        <Button
          className="p-0 h-auto hover:bg-transparent"
          effect="expandIcon"
          icon={MoveLeft}
          iconPlacement="left"
          variant="link"
          onClick={() => router.back()}
        >
          Back Now
        </Button>
      </div>

      <h1 className="text-xl md:text-2xl font-medium uppercase tracking-widest">
        Escalate Dispute
      </h1>

      <div className="space-y-6 md:space-y-8 mt-6 md:mt-8">
        <AboutDisputes
          disputesDetails={disputesDetails}
          isLoading={isLoading}
        />

        <EscalateForm />
      </div>
    </div>
  );
};

export default page;
