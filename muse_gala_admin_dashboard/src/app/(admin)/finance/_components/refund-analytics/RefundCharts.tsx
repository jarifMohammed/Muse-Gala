import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444", "#8b5cf6"];

interface ChartItem {
    status?: string;
    reason?: string;
    refundType?: string;
    count: number;
    totalAmount: number;
}

const RefundCharts = ({ byStatus = [], byReason = [] }: { byStatus: ChartItem[]; byReason: ChartItem[]; byType?: ChartItem[] }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* By Status */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">By Status</h3>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={byStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="totalAmount"
                                nameKey="status"
                            >
                                {byStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* By Reason */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">By Reason (Top 5)</h3>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={byReason.slice(0, 5)}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="reason"
                                width={100}
                                fontSize={10}
                                tick={{ fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="totalAmount" radius={[0, 4, 4, 0]}>
                                {byReason.slice(0, 5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RefundCharts;
