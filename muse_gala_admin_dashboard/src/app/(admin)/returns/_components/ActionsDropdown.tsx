/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, DollarSign, Image as ImageIcon, FileText, Send } from "lucide-react";
import { resendReturnLink } from "@/lib/return-api";
import { toast } from "sonner";

interface ActionsDropdownProps {
    item: any;
    token: string;
    onResendLink: (data: any) => void;
    onApproveCharge: (item: any) => void;
    onViewReceipt: (url: string) => void;
    onViewNotes: (notes: string) => void;
    onActionSuccess: () => void;
}

const ActionsDropdown = ({
    item,
    token,
    onResendLink,
    onApproveCharge,
    onViewReceipt,
    onViewNotes,
}: ActionsDropdownProps) => {
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        try {
            const res = await resendReturnLink(token, item.bookingId);
            onResendLink(res.data);
            toast.success("Return link generated successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to generate return link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleResend} disabled={loading} className="cursor-pointer">
                    <Send className="mr-2 h-4 w-4" />
                    <span>Resend Link</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onApproveCharge(item)} className="cursor-pointer">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Approve Charge</span>
                </DropdownMenuItem>

                {item.receiptPhoto && (
                    <DropdownMenuItem onClick={() => onViewReceipt(item.receiptPhoto)} className="cursor-pointer">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        <span>View Receipt</span>
                    </DropdownMenuItem>
                )}

                {item.customerNotes && (
                    <DropdownMenuItem onClick={() => onViewNotes(item.customerNotes)} className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>View Notes</span>
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionsDropdown;
