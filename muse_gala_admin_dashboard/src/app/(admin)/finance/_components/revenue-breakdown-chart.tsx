/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { RevenueBreakdownType } from "./finance-header";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

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

// Professional color palette - Modern & Accessible
const COLOR_PALETTE = {
  subscriptionRevenue: "#4F46E5", // Indigo - Premium feel
  totalLenderPayout: "#059669", // Emerald Green - Financial growth
  pendingPayout: "#F59E0B", // Amber - Attention needed
  commissionEarned: "#7C3AED", // Violet - Earning
  totalCreditIssued: "#0EA5E9", // Sky Blue - Credit/Trust
  insuranceCollected: "#EC4899", // Pink - Protection/Safety
  shippingFeeCollected: "#F97316", // Orange - Logistics
  platformRevenue: "#6366F1", // Primary Blue - Core revenue
};

// Gradient colors for better visual appeal
const GRADIENT_COLORS = {
  subscriptionRevenue: ["#4F46E5", "#6366F1"],
  totalLenderPayout: ["#059669", "#10B981"],
  pendingPayout: ["#F59E0B", "#FBBF24"],
  commissionEarned: ["#7C3AED", "#8B5CF6"],
  totalCreditIssued: ["#0EA5E9", "#38BDF8"],
  insuranceCollected: ["#EC4899", "#F472B6"],
  shippingFeeCollected: ["#F97316", "#FB923C"],
  platformRevenue: ["#6366F1", "#818CF8"],
};

const getMonthName = (month: string) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNum = parseInt(month);
  return months[monthNum - 1] || "";
};

const prepareChartData = (monthlyData: Monthly[]) => {
  if (!monthlyData || monthlyData.length === 0) return [];

  // Get the latest month's data
  const latestMonth = monthlyData.sort((a, b) => {
    const dateA = new Date(parseInt(a.year), parseInt(a.month) - 1);
    const dateB = new Date(parseInt(b.year), parseInt(b.month) - 1);
    return dateB.getTime() - dateA.getTime();
  })[0];

  const data = [
    {
      category: "subscriptionRevenue",
      value: parseFloat(latestMonth.subscriptionRevenue) || 0,
      fill: COLOR_PALETTE.subscriptionRevenue,
      gradient: GRADIENT_COLORS.subscriptionRevenue,
      label: "Subscription",
      description: "Recurring subscription income",
    },
    {
      category: "totalLenderPayout",
      value: parseFloat(latestMonth.totalLenderPayout) || 0,
      fill: COLOR_PALETTE.totalLenderPayout,
      gradient: GRADIENT_COLORS.totalLenderPayout,
      label: "Lender Payout",
      description: "Payments to lenders",
    },
    {
      category: "pendingPayout",
      value: parseFloat(latestMonth.pendingPayout) || 0,
      fill: COLOR_PALETTE.pendingPayout,
      gradient: GRADIENT_COLORS.pendingPayout,
      label: "Pending Payout",
      description: "Awaiting distribution",
    },
    {
      category: "commissionEarned",
      value: parseFloat(latestMonth.commissionEarned) || 0,
      fill: COLOR_PALETTE.commissionEarned,
      gradient: GRADIENT_COLORS.commissionEarned,
      label: "Commission",
      description: "Service commission",
    },
    {
      category: "totalCreditIssued",
      value: parseFloat(latestMonth.totalCreditIssued) || 0,
      fill: COLOR_PALETTE.totalCreditIssued,
      gradient: GRADIENT_COLORS.totalCreditIssued,
      label: "Credit Issued",
      description: "Platform credit provided",
    },
    {
      category: "insuranceCollected",
      value: parseFloat(latestMonth.insuranceCollected) || 0,
      fill: COLOR_PALETTE.insuranceCollected,
      gradient: GRADIENT_COLORS.insuranceCollected,
      label: "Insurance",
      description: "Insurance premiums",
    },
    {
      category: "shippingFeeCollected",
      value: parseFloat(latestMonth.shippingFeeCollected) || 0,
      fill: COLOR_PALETTE.shippingFeeCollected,
      gradient: GRADIENT_COLORS.shippingFeeCollected,
      label: "Shipping",
      description: "Shipping & logistics fees",
    },
    {
      category: "platformRevenue",
      value: parseFloat(latestMonth.platformRevenue) || 0,
      fill: COLOR_PALETTE.platformRevenue,
      gradient: GRADIENT_COLORS.platformRevenue,
      label: "Platform Revenue",
      description: "Core platform earnings",
    },
  ];

  // Filter out zero values and sort by value (largest first)
  return data
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
};

const RevenueBreakdownChart = ({
  revenueBreakdown,
}: {
  revenueBreakdown: RevenueBreakdownType;
}) => {
  const monthlyData = revenueBreakdown?.data?.monthly || [];

  if (monthlyData.length === 0) {
    return (
      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>No data available</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <div className="text-center text-gray-500">
              <p>No revenue data available</p>
              <p className="text-sm text-gray-400 mt-2">
                Please check back later
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestMonth = monthlyData.sort((a, b) => {
    const dateA = new Date(parseInt(a.year), parseInt(a.month) - 1);
    const dateB = new Date(parseInt(b.year), parseInt(b.month) - 1);
    return dateB.getTime() - dateA.getTime();
  })[0];

  const chartData = prepareChartData(monthlyData);

  const chartConfig = {
    value: {
      label: "Amount",
    },
    subscriptionRevenue: {
      label: "Subscription",
      color: COLOR_PALETTE.subscriptionRevenue,
    },
    totalLenderPayout: {
      label: "Lender Payout",
      color: COLOR_PALETTE.totalLenderPayout,
    },
    pendingPayout: {
      label: "Pending Payout",
      color: COLOR_PALETTE.pendingPayout,
    },
    commissionEarned: {
      label: "Commission",
      color: COLOR_PALETTE.commissionEarned,
    },
    totalCreditIssued: {
      label: "Credit Issued",
      color: COLOR_PALETTE.totalCreditIssued,
    },
    insuranceCollected: {
      label: "Insurance",
      color: COLOR_PALETTE.insuranceCollected,
    },
    shippingFeeCollected: {
      label: "Shipping",
      color: COLOR_PALETTE.shippingFeeCollected,
    },
    platformRevenue: {
      label: "Platform Revenue",
      color: COLOR_PALETTE.platformRevenue,
    },
  } satisfies ChartConfig;

  // Calculate total for percentage display
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (monthlyData.length < 2) return 0;

    const sortedData = monthlyData.sort((a, b) => {
      const dateA = new Date(parseInt(a.year), parseInt(a.month) - 1);
      const dateB = new Date(parseInt(b.year), parseInt(b.month) - 1);
      return dateB.getTime() - dateA.getTime();
    });

    const current = sortedData[0];
    const previous = sortedData[1];

    const currentTotal = Object.values(current).reduce(
      (sum: number, val: any) => {
        if (typeof val === "string" && !isNaN(parseFloat(val))) {
          return sum + parseFloat(val);
        }
        return sum;
      },
      0
    );

    const previousTotal = Object.values(previous).reduce(
      (sum: number, val: any) => {
        if (typeof val === "string" && !isNaN(parseFloat(val))) {
          return sum + parseFloat(val);
        }
        return sum;
      },
      0
    );

    if (previousTotal === 0) return 0;

    return (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1);
  };

  const growthPercentage = calculateGrowth();

  return (
    <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg">
      <div className="h-[500px]">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Revenue Distribution
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getMonthName(latestMonth.month)} {latestMonth.year}
              </CardDescription>
            </div>
            {growthPercentage !== 0 && (
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  Number(growthPercentage) > 0
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {Number(growthPercentage) > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4 rotate-180" />
                )}
                {Math.abs(Number(growthPercentage))}%
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="flex flex-col lg:flex-row items-start">
            {/* Chart Section */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[400px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value, name) => {
                            const item = chartData.find(
                              (d) => d.category === name
                            );
                            const percentage =
                              totalValue > 0
                                ? (
                                    (parseFloat(value as string) / totalValue) *
                                    100
                                  ).toFixed(1)
                                : "0";
                            return [
                              <div key="value" className="font-semibold">
                                ${parseFloat(value as string).toLocaleString()}
                              </div>,
                              <div
                                key="percentage"
                                className="text-sm text-gray-600"
                              >
                                {percentage}% of total
                              </div>,
                              <div
                                key="description"
                                className="text-xs text-gray-500 mt-1"
                              >
                                {item?.description}
                              </div>,
                            ];
                          }}
                        />
                      }
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="category"
                      innerRadius="40%"
                      outerRadius="80%"
                      paddingAngle={2}
                      stroke="white"
                      strokeWidth={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          className="transition-opacity hover:opacity-90"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                {totalValue > 0 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ${totalValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                )}
              </div>
            </div>

            {/* Legend Section - Enhanced */}
            <div className="w-full lg:w-[75%] h-[400px] overflow-y-scroll scrollbar">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-900 mb-4">
                  Revenue Breakdown
                </div>
                <div className="space-y-3">
                  {chartData.map((item) => {
                    const percentage =
                      totalValue > 0
                        ? ((item.value / totalValue) * 100).toFixed(1)
                        : "0";

                    return (
                      <div
                        key={item.category}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.fill }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 text-sm">
                              ${item.value.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {percentage}%
                            </div>
                          </div>
                          <div
                            className="w-2 h-8 rounded-full"
                            style={{
                              background: `linear-gradient(to bottom, ${item.gradient[0]}, ${item.gradient[1]})`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                {chartData.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        Revenue Sources
                      </div>
                      <div className="text-sm text-gray-600">
                        {chartData.length} active streams
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Hover over chart segments for detailed information
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default RevenueBreakdownChart;
