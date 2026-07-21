"use client";
import React, { useState } from "react";
import RefundSummaryCards from "./RefundSummaryCards";
import RefundTable from "./RefundTable";
import { useGetRefundAnalytics } from "@/lib/finance-api";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const RefundAnalytics = ({ token }: { token: string }) => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
    });

    const { data, isLoading, refetch, isRefetching, error } = useGetRefundAnalytics(token, filters);

    if (!token) {
        return (
            <div className="flex items-center justify-center p-20 border border-dashed rounded-xl bg-gray-50 text-gray-400">
                <p>Authenticating...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border border-red-100 rounded-xl bg-red-50 text-red-600">
                <p className="font-bold mb-2">Error loading analytics</p>
                <p className="text-sm">{(error as Error).message}</p>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
                    Try Again
                </Button>
            </div>
        );
    }


    const hasData = !!(data && (
        (data.refunds?.data && data.refunds.data.length > 0) ||
        (data.summary && data.summary.totalRefundedBookings > 0)
    ));

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Refund Analytics</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor and analyze refund patterns across all bookings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isLoading || isRefetching}
                        className="text-xs h-10 gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <RefundSummaryCards data={data?.summary} loading={isLoading} />

            {!isLoading && hasData ? (
                <>
                    <RefundTable
                        data={data?.refunds?.data || []}
                        pagination={data?.refunds?.pagination}
                        onPageChange={(page) => setFilters({ ...filters, page })}
                        loading={isLoading}
                    />
                </>
            ) : !isLoading && (
                <div className="flex flex-col items-center justify-center p-20 border border-dashed rounded-xl bg-gray-50 text-gray-500">
                    <p>No refund data available yet.</p>
                </div>
            )}

            {isLoading && (
                <div className="space-y-8 animate-pulse">
                    <div className="h-[400px] bg-gray-50 rounded-xl" />
                    <div className="h-[400px] bg-gray-50 rounded-xl" />
                    <div className="h-[500px] bg-gray-50 rounded-xl" />
                </div>
            )}
        </div>
    );
};

export default RefundAnalytics;
