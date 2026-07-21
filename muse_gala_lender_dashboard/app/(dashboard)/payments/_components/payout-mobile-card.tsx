"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Payout {
    _id: string;
    lenderId: string;
    bookingId: string;
    bookingAmount: number;
    lenderPrice?: number;
    requestedAmount: number;
    commission: number;
    status: string;
    requestedAt: string;
}

interface PayoutMobileCardProps {
    payout: Payout;
}

const PayoutMobileCard = ({ payout }: PayoutMobileCardProps) => {
    return (
        <Card className="shadow-md border-none mb-4 overflow-hidden bg-white rounded-xl">
            <CardContent className="p-4 space-y-3">
                {/* Header: IDs and Status */}
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Payout ID</span>
                            <span className="text-xs font-mono font-medium truncate max-w-[120px]">{payout._id}</span>
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${payout.status === "pending"
                                ? "text-orange-700 bg-orange-100 border border-orange-200"
                                : "text-green-700 bg-green-100 border border-green-200"
                            }`}
                    >
                        {payout.status}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-4 pt-2 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Booking ID</span>
                        <span className="text-xs font-medium">{payout.bookingId}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Requested At</span>
                        <span className="text-xs font-medium">{new Date(payout.requestedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Dress Price</span>
                        <span className="text-sm font-bold text-gray-900">${payout.lenderPrice || payout.bookingAmount}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Commission</span>
                        <span className="text-sm font-bold text-gray-600">{payout.commission}%</span>
                    </div>
                </div>

                {/* Footer: Req Amount */}
                <div className="bg-gray-50 -mx-4 -mb-4 px-4 py-3 mt-4 flex justify-between items-center border-t border-gray-100">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Requested Amount</span>
                    <span className="text-lg font-black text-black">${payout.requestedAmount}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default PayoutMobileCard;
