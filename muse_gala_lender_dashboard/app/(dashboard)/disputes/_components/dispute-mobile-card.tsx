"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoreHorizontal, Copy } from "lucide-react";
import { toast } from "sonner";

interface Dispute {
    _id: string;
    booking: {
        _id: string;
        customer: {
            _id: string;
        };
    };
    issueType: string;
    status: string;
    createdAt: string;
}

interface DisputeMobileCardProps {
    dispute: Dispute;
    getStatusColor: (status: string) => string;
}

const DisputeMobileCard = ({ dispute, getStatusColor }: DisputeMobileCardProps) => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <Card className="shadow-md border-none mb-4 overflow-hidden bg-white rounded-xl">
            <CardContent className="p-4 space-y-3">
                {/* Header: Status and Date */}
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Submitted On</span>
                        <span className="text-xs font-medium">{new Date(dispute.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${getStatusColor(dispute.status)}`}
                    >
                        {dispute.status}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-y-3 pt-2 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Booking ID</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{dispute.booking?._id}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-[#54051d]"
                                onClick={() => handleCopy(dispute.booking?._id, "Booking ID")}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Reason</span>
                        <span className="text-sm font-medium">{dispute.issueType}</span>
                    </div>
                </div>

                {/* Footer: Action */}
                <div className="bg-gray-50 -mx-4 -mb-4 px-4 py-3 mt-4 flex justify-between items-center border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Customer ID</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-600 truncate max-w-[120px]">{dispute.booking?.customer?._id}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-[#54051d]"
                                onClick={() => handleCopy(dispute.booking?.customer?._id, "Customer ID")}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                    <Link href={`/disputes/${dispute._id}`}>
                        <Button size="icon" className="h-9 w-9 font-bold bg-[#54051d] hover:bg-[#6b0726]">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default DisputeMobileCard;
