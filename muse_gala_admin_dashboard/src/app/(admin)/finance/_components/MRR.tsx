"use client";
import React from "react";
import MrrStates from "./mrr-states";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface CommonTypes {
  _id: string;
  customerId: string;
  name: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  amount: string;
  status: string;
}

interface MrrTrend {
  month: string;
  mrr: string;
}

export interface MrrData {
  totalMRR: string;
  totalNewSignUps: string;
  totalCancelledSubscribers: string;
  activeSubscribers: CommonTypes[];
  newSignUps: CommonTypes[];
  churnedUsers: CommonTypes[];
  mrrTrend: MrrTrend[];
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const MRR = ({ token }: { token: string }) => {
  const { data: mrrData } = useQuery({
    queryKey: ["mrr"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/overview/dashboard/finance/subscriptionAnalytics`,
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

  const chartData = mrrData?.mrrTrend || [];

  return (
    <div className="space-y-8">
      <div>
        <MrrStates mrrData={mrrData} />

        <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl ">MRR Trend</h1>

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">Weekly</SelectItem>
                  <SelectItem value="banana">Monthly</SelectItem>
                  <SelectItem value="blueberry">Yearly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Card className="h-[400px]">
              <CardContent className="h-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 30,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      textAnchor="end"
                      height={50}
                      angle={-45}
                      interval={0}
                      tickFormatter={(value) => {
                        const [year, month] = value.split("-");
                        const date = new Date(`${year}-${month}-01`);
                        const monthName = date.toLocaleDateString("en-US", {
                          month: "short",
                        });
                        const yearShort = year.slice(2);
                        return `${monthName} '${yearShort}`;
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="mrr"
                      type="natural"
                      stroke="#891d33"
                      strokeWidth={2}
                      dot={true}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRR;
