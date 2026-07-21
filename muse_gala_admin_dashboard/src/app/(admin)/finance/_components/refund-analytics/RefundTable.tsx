import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/custom/skeleton";
import { Copy, Check } from "lucide-react";

interface RefundTableProps {
    data: Array<{
        bookingId: string;
        customerName: string;
        customerEmail: string;
        dressName: string;
        brand: string;
        originalAmount: number;
        paymentStatus: string;
        totalRefunded: number;
        refundDetails: Array<{
            stripeRefundId: string;
            reason?: string;
            refundType?: string;
            processedBy?: string;
        }>;
        bookingDate: string;
    }>;
    pagination: {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
    } | undefined;
    onPageChange: (page: number) => void;
    loading: boolean;
}

const getStatusBadgeStyle = (status: string) => {
    switch (status) {
        case 'Refunded':
        case 'Succeeded':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'RefundPending':
        case 'Pending':
            return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'PartiallyRefunded':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-primary bg-gray-50 border border-gray-200"
            title="Copy ID"
        >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </button>
    );
};

const IdCell = ({ id, link }: { id: string; link?: string }) => {
    if (!id) return <span className="text-gray-400">N/A</span>;

    return (
        <div className="group relative flex items-center gap-2">
            <div className="flex items-center gap-2">
                {link ? (
                    <Link href={link} className="text-primary font-bold hover:underline text-[13px] uppercase tracking-tight">
                        #{id.slice(-8)}
                    </Link>
                ) : (
                    <span className="text-[13px] font-bold text-gray-700 uppercase tracking-tight">
                        {id.slice(0, 8)}...
                    </span>
                )}
            </div>

            {/* Hover Reveal Content */}
            <div className="invisible group-hover:visible absolute left-0 -top-10 z-50 flex items-center gap-2 bg-gray-900 text-white p-2 rounded-lg shadow-xl border border-gray-700 min-w-max translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                <span className="text-[11px] font-mono tracking-wider tabular-nums px-1">
                    {id}
                </span>
                <div className="h-4 w-[1px] bg-gray-700 mx-1" />
                <CopyButton text={id} />
                {/* Arrow */}
                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 rotate-45 border-b border-r border-gray-700" />
            </div>
        </div>
    );
};

const RefundTable = ({ data, pagination, onPageChange, loading }: RefundTableProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-white">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Refund Details Table</h3>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-[1300px] font-sans">
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Booking ID</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Refund ID</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Customer</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Dress</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Reason</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Type</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Processed By</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">Status</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Orig. Amount</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Refunded</TableHead>
                            <TableHead className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 11 }).map((_, j) => (
                                        <TableCell key={j} className="p-4">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : data.length > 0 ? (
                            data.map((item) => {
                                const mainRefund = item.refundDetails?.[0] || {};
                                return (
                                    <TableRow key={item.bookingId} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="px-6 py-4">
                                            <IdCell id={item.bookingId} link={`/bookings/${item.bookingId}`} />
                                        </TableCell>
                                        <TableCell className="px-6 py-4 border-l border-gray-50">
                                            <IdCell id={mainRefund.stripeRefundId} />
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{item.customerName}</span>
                                                <span className="text-xs text-gray-400">{item.customerEmail}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{item.dressName}</span>
                                                <span className="text-xs text-gray-400">{item.brand}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-xs text-gray-600 font-medium">
                                                {mainRefund.reason || "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {mainRefund.refundType || "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="text-xs text-gray-600">
                                                {mainRefund.processedBy || "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={`font-medium ${getStatusBadgeStyle(item.paymentStatus)}`}>
                                                {item.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <span className="text-sm text-gray-500">
                                                ${(item.originalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-gray-900">
                                                ${(item.totalRefunded || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(item.bookingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-12 text-gray-400 font-medium">
                                    No refund records found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        Showing <span className="font-semibold">{Math.min(data.length, (pagination.currentPage - 1) * pagination.itemsPerPage + 1)} - {Math.min(pagination.totalItems, pagination.currentPage * pagination.itemsPerPage)}</span> of <span className="font-semibold">{pagination.totalItems}</span> entries
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.currentPage === 1}
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            className="h-8 text-[11px]"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            className="h-8 text-[11px]"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundTable;
