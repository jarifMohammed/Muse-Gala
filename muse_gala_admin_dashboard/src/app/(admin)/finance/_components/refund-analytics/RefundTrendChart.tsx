import React from "react";
import moment from "moment";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

interface TrendDataItem {
    month: string;
    totalAmount: number;
    count: number;
}

const RefundTrendChart = ({ data = [] }: { data: TrendDataItem[] }) => {
    const chartData = (data || []).map((item) => {
        // Handle "YYYY-MM" string format
        const dateStr = item.month; // e.g., "2026-02"
        const formattedDate = dateStr ? moment(dateStr, "YYYY-MM").format("MMM YYYY") : "Unknown";

        return {
            name: formattedDate,
            amount: item.totalAmount || 0,
            count: item.count || 0,
        };
    });

    if (chartData.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8 h-[400px] flex flex-col">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">MONTHLY TREND (Last 6 Months)</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RefundTrendChart;
