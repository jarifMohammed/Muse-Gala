"use client";
import React from "react";
import FinanceCard from "./finance-card";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PromoTypes {
  totalIssuedDiscount: string;
  totalDiscountGiven: string;
  usageData: {
    bookingId: string;
    promoCodeName: string;
    promoCodeDiscount: string;
    userName: string;
    userEmail: string;
    discountApplied: string;
    usedAt: string;
    expireAt: string;
  }[];
}

const CreditPromotions = ({ token }: { token: string }) => {
  const { data: promo } = useQuery<PromoTypes>({
    queryKey: ["lenders-payout"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/promo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data;
    },
    enabled: !!token,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-8">
        <FinanceCard
          title="Total Credit Issued"
          value={promo?.totalIssuedDiscount as string}
        />
        <FinanceCard
          title="Total Credit Used"
          value={promo?.totalDiscountGiven as string}
        />
      </div>

      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg">
        <h1 className="text-2xl font-medium mb-8">Lenders Payout</h1>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Booking Id</TableHead>
                <TableHead className="text-center">User Name</TableHead>
                <TableHead className="text-center">User Email</TableHead>
                <TableHead className="text-center">PromoCode Name</TableHead>
                <TableHead className="text-center">
                  PromoCode Discount
                </TableHead>
                <TableHead className="text-center">Discount Applied</TableHead>
                <TableHead className="text-center">Used At</TableHead>
                <TableHead className="text-center">Expire At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {promo?.usageData?.map((item) => (
                <TableRow key={item?.bookingId} className="text-center">
                  <TableCell>{item?.bookingId || "N/A"}</TableCell>
                  <TableCell>{item?.userName}</TableCell>
                  <TableCell>{item?.userEmail || "0"}</TableCell>
                  <TableCell>{item?.promoCodeName}</TableCell>
                  <TableCell className="font-sans">$ {item?.promoCodeDiscount}</TableCell>
                  <TableCell className="font-sans">$ {item?.discountApplied}</TableCell>
                  <TableCell className="font-sans">
                    {new Date(item?.usedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-sans">
                    {new Date(item?.expireAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CreditPromotions;
