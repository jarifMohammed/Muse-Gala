'use client'
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const PaymentSuccess = ({ token, id }: { token: string; id: string }) => {
  const router = useRouter();

  const { data: profile = {} } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data?.data;
    },
    enabled: !!token && !!id,
  });

  useEffect(() => {
    if (profile?.stripeCustomerId && profile?.defaultPaymentMethodId) {
      router.push("/payment/success");
    } else {
      router.push("/");
    }
  });

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center ">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Payment Successful!
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Thank you for your order. Your payment has been processed successfully.
      </p>

      <Link href={`/bookings`}>
        <Button>Back to bookings</Button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
