"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import BookingRevenue from "./booking-revenue";
import PayoutSummery from "./payout-summery";
import MRR from "./MRR";
import CreditPromotions from "./credit-promotions";
import RevenueBreakdown from "./revenue-breakdown";
import RefundAnalytics from "./refund-analytics/RefundAnalytics";
import { RevenueBreakdownType } from "./finance-header";

const tabs = [
  {
    id: 1,
    label: "Revenue Breakdown",
  },
  {
    id: 2,
    label: "MRR",
  },
  {
    id: 3,
    label: "Payout Summary",
  },
  {
    id: 4,
    label: "Booking Revenue",
  },
  {
    id: 5,
    label: "Refunds & Losses",
  },
  {
    id: 6,
    label: "Credit and Promotions",
  },
];

const FinanceTabs = ({
  token,
  revenueBreakdown,
  isLoading,
}: {
  token: string;
  revenueBreakdown: RevenueBreakdownType;
  isLoading: boolean;
}) => {
  const [isActive, setIsActive] = useState("Revenue Breakdown");

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-md space-x-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            className={`${isActive === tab.label
                ? "bg-primary"
                : "bg-inherit border border-black text-black hover:bg-inherit hover:text-black"
              }`}
            onClick={() => setIsActive(tab.label)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div>
        {isActive === "Booking Revenue" && (
          <BookingRevenue token={token as string} />
        )}{" "}
        {isActive === "Payout Summary" && (
          <PayoutSummery token={token as string} />
        )}
        {isActive === "MRR" && <MRR token={token as string} />}
        {isActive === "Credit and Promotions" && (
          <CreditPromotions token={token as string} />
        )}
        {isActive === "Revenue Breakdown" && (
          <RevenueBreakdown
            revenueBreakdown={revenueBreakdown}
            isLoading={isLoading}
          />
        )}
        {isActive === "Refunds & Losses" && (
          <RefundAnalytics token={token as string} />
        )}
      </div>
    </div>
  );
};

export default FinanceTabs;
