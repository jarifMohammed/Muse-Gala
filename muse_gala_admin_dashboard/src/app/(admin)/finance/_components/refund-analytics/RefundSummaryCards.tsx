import React from "react";
import { DollarSign, Hourglass, Package, BarChart3 } from "lucide-react";

interface SummaryData {
    totalRefundedBookings: number;
    totalRefundAmount: number;
    avgRefundAmount: number;
    totalRefundTransactions: number;
}

const StatCard = ({ label, count, subtext, icon: Icon, prefix = "" }: { label: string; count: number | string; subtext?: string; icon: React.ElementType; prefix?: string }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm font-medium">{label}</span>
            <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
        </div>
        <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
                {prefix}{typeof count === 'number' ? count.toLocaleString(undefined, { minimumFractionDigits: count % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }) : count}
            </span>
            {subtext && <span className="text-xs text-gray-400 mt-1">{subtext}</span>}
        </div>
    </div>
);

const RefundSummaryCards = ({ data, loading }: { data?: SummaryData; loading: boolean }) => {
    if (loading || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
                label="TOTAL REFUNDED"
                count={data.totalRefundAmount}
                prefix="$"
                subtext="Processed Amount"
                icon={DollarSign}
            />
            <StatCard
                label="AVG REFUND"
                count={data.avgRefundAmount}
                prefix="$"
                subtext="Per booking"
                icon={BarChart3}
            />
            <StatCard
                label="REFUNDED BOOKINGS"
                count={data.totalRefundedBookings}
                subtext="Count"
                icon={Package}
            />
            <StatCard
                label="TRANSACTIONS"
                count={data.totalRefundTransactions}
                subtext="Total processed"
                icon={Hourglass}
            />
        </div>
    );
};

export default RefundSummaryCards;
