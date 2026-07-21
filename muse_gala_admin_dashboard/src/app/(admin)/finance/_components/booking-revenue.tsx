import React from "react";
import FinanceCard from "./finance-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
export const description = "A line chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Summary {
  totalBookingRevenue: string;
  averageOrderValue: string;
  averageProfitPerOrder: string;
  momChange: string;
}

interface Monthly {
  month: string;
  revenue: string;
}

interface BookingRevenue {
  summary: Summary;
  monthly: Monthly[];
}

interface Props {
  token: string;
}

const BookingRevenue = ({ token }: Props) => {
  const { data: bookingRevenue } = useQuery<BookingRevenue>({
    queryKey: ["booking-revenue"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/overview/dashboard/finance/booking-revenue`,
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

  const chartData = bookingRevenue?.monthly || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-8">
        <FinanceCard
          title="Total Booking Revenue"
          value={bookingRevenue?.summary?.totalBookingRevenue as string}
        />
        <FinanceCard
          title="MoM % Change"
          value={bookingRevenue?.summary?.momChange || ("0" as string)}
        />
        <FinanceCard
          title="Average Order Value"
          value={
            Number(bookingRevenue?.summary?.averageOrderValue).toFixed(
              2
            ) as string
          }
        />
        <FinanceCard
          title="Average Profit per Order"
          value={bookingRevenue?.summary?.averageProfitPerOrder as string}
        />
      </div>

      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl ">Booking Revenue</h1>

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
                    cursor={true}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="revenue"
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
  );
};

export default BookingRevenue;
