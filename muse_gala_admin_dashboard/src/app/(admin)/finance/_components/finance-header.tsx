"use client";
import React from "react";
import FinanceCard from "./finance-card";
import FinanceTabs from "./finance-tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

interface Monthly {
  year: string;
  month: string;
  subscriptionRevenue: string;
  totalLenderPayout: string;
  pendingPayout: string;
  commissionEarned: string;
  totalCreditIssued: string;
  insuranceCollected: string;
  shippingFeeCollected: string;
  platformRevenue: string;
}

export interface RevenueBreakdownType {
  data: {
    overall: {
      platformRevenue: string;
      subscriptionRevenue: string;
      totalLenderPayout: string;
      pendingPayout: string;
      commissionEarned: string;
      totalCreditIssued: string;
      insuranceCollected: string;
      shippingFeeCollected: string;
    };
    monthly: Monthly[];
  };
}

const FinanceHeader = ({ token }: { token: string }) => {
  const session = useSession();
  const status = session?.status;

  const { data: revenueBreakdown, isLoading } = useQuery<RevenueBreakdownType>({
    queryKey: ["revenue-breakdown"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/overview/dashboard/finance/revenue-breakdown`,
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
  });

  const isInitialLoading = status === "loading" || isLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[25px] tracking-[0.5rem] uppercase font-medium">
          Manage Finance
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isInitialLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white shadow-[0px_4px_10px_0px_#0000001A] h-[150px] p-5 rounded-lg flex flex-col justify-center"
            >
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-8 w-1/2 mt-5" />
            </div>
          ))
        ) : (
          <>
            <FinanceCard
              title="Total Platform Revenue"
              value={revenueBreakdown?.data?.overall?.platformRevenue as string}
            />
            <FinanceCard
              title="Total Lender Payouts"
              value={
                revenueBreakdown?.data?.overall?.totalLenderPayout as string
              }
            />
            <FinanceCard
              title="Pending Payouts"
              value={revenueBreakdown?.data?.overall?.pendingPayout as string}
            />
            <FinanceCard
              title="Commission Earned"
              value={
                revenueBreakdown?.data?.overall?.commissionEarned as string
              }
            />
            <FinanceCard
              title="Insurance Collected"
              value={
                revenueBreakdown?.data?.overall?.insuranceCollected as string
              }
            />
            <FinanceCard
              title="Credits Issued"
              value={
                revenueBreakdown?.data?.overall?.totalCreditIssued as string
              }
            />
            <FinanceCard
              title="Shipping Fee Collected"
              value={
                revenueBreakdown?.data?.overall?.shippingFeeCollected as string
              }
            />
            <FinanceCard
              title="Subscription Revenue"
              value={
                revenueBreakdown?.data?.overall?.subscriptionRevenue as string
              }
            />
          </>
        )}
      </div>

      <div>
        <FinanceTabs
          token={token as string}
          revenueBreakdown={revenueBreakdown as RevenueBreakdownType}
          isLoading={isInitialLoading}
        />
      </div>
    </div>
  );
};

export default FinanceHeader;
