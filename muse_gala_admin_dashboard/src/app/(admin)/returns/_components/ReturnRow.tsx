/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Mail, Copy } from "lucide-react";
import { toast } from "sonner";
import ActionsDropdown from "./ActionsDropdown";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReturnRowProps {
    item: any;
    onResendLink: (data: any) => void;
    onApproveCharge: (item: any) => void;
    onViewReceipt: (url: string) => void;
    onViewNotes: (notes: string) => void;
    token: string;
    onActionSuccess: () => void;
}

const getStatusBadgeStyle = (status: string) => {
    switch (status) {
        case 'ReturnLinkSent': return 'bg-blue-500 text-white hover:bg-blue-600';
        case 'InTransit': return 'bg-amber-500 text-white hover:bg-amber-600';
        case 'DroppedOff': return 'bg-teal-500 text-white hover:bg-teal-600';
        case 'LateReturn': return 'bg-orange-600 text-white hover:bg-orange-700';
        case 'Overdue': return 'bg-orange-700 text-white hover:bg-orange-800';
        case 'Escalated': return 'bg-red-600 text-white hover:bg-red-700';
        case 'HighRisk': return 'bg-red-800 text-white hover:bg-red-900';
        case 'NonReturned': return 'bg-gray-800 text-white hover:bg-gray-900';
        case 'ReceivedByLender': return 'bg-green-600 text-white hover:bg-green-700';
        default: return 'bg-gray-400 text-white hover:bg-gray-500';
    }
};

const getDaysOverdueColor = (days: number) => {
    if (days <= 0) return 'text-green-600';
    if (days <= 3) return 'text-amber-500';
    if (days <= 7) return 'text-orange-600';
    return 'text-red-600';
};

const ReturnRow = ({
    item,
    onResendLink,
    onApproveCharge,
    onViewReceipt,
    onViewNotes,
    token,
    onActionSuccess
}: ReturnRowProps) => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <TableRow className="hover:bg-gray-50/50 transition-colors">
            <TableCell className="font-medium">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <Link href={`/bookings/${item.bookingId}`} className="text-primary hover:underline">
                                    #{item.bookingId.slice(-6).toUpperCase()}
                                </Link>
                                <Copy
                                    className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:text-primary cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        copyToClipboard(item.bookingId);
                                    }}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{item.bookingId}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>
            <TableCell className="max-w-[150px] truncate" title={item.dressName}>
                {item.dressName}
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{item.customerName}</span>
                    <div className="flex gap-2 mt-1">
                        <a href={`mailto:${item.customerEmail}`} className="text-gray-400 hover:text-primary">
                            <Mail className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </TableCell>
            <TableCell>{item.lenderName}</TableCell>
            <TableCell className="text-gray-600">{formatDate(item.returnDueDate)}</TableCell>
            <TableCell className={`font-semibold ${getDaysOverdueColor(item.daysOverdue)}`}>
                {item.daysOverdue} days
            </TableCell>
            <TableCell>
                <Badge className={`whitespace-nowrap ${getStatusBadgeStyle(item.currentStatus)}`}>
                    {item.currentStatus.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
            </TableCell>
            <TableCell className="text-gray-600">{item.returnMethod || '—'}</TableCell>
            <TableCell>
                {item.trackingNumber ? (
                    <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => copyToClipboard(item.trackingNumber)}>
                        <span className="text-gray-600">{item.trackingNumber}</span>
                        <Copy className="w-3 h-3 text-gray-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                ) : '—'}
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">${(item.suggestedLateFee || 0).toFixed(2)}</span>
                    {item.lateFeeApproved && <span className="text-[10px] text-green-600 font-medium">APPROVED</span>}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <ActionsDropdown
                    item={item}
                    token={token}
                    onResendLink={onResendLink}
                    onApproveCharge={onApproveCharge}
                    onViewReceipt={onViewReceipt}
                    onViewNotes={onViewNotes}
                    onActionSuccess={onActionSuccess}
                />
            </TableCell>
        </TableRow>
    );
};

export default ReturnRow;
