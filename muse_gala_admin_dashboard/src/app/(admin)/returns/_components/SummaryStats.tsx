import React from "react";
import { Clock, AlertTriangle, AlertCircle, AlertOctagon, XCircle, BarChart2 } from "lucide-react";

interface SummaryData {
    lateReturn: number;
    overdue: number;
    escalated: number;
    highRisk: number;
    nonReturned: number;
    totalRequiringAttention: number;
}

const StatCard = ({ label, count, icon: Icon }: { label: string; count: number; icon: React.ElementType }) => (
    <div
        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1 transition-all hover:shadow-md"
    >
        <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm font-medium">{label}</span>
            <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <span className="text-2xl font-bold text-gray-900">
            {count}
        </span>
    </div>
);

const SummaryStats = ({ data }: { data: SummaryData | null }) => {
    if (!data) return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label="Late Return" count={data.lateReturn} icon={Clock} />
            <StatCard label="Overdue" count={data.overdue} icon={AlertTriangle} />
            <StatCard label="Escalated" count={data.escalated} icon={AlertCircle} />
            <StatCard label="High Risk" count={data.highRisk} icon={AlertOctagon} />
            <StatCard label="Non-Returned" count={data.nonReturned} icon={XCircle} />
            <StatCard label="Total" count={data.totalRequiringAttention} icon={BarChart2} />
        </div>
    );
};

export default SummaryStats;
