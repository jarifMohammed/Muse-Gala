/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ReturnRow from "./ReturnRow";

interface ReturnsTableProps {
    data: any[];
    isLoading: boolean;
    onResendLink: (data: any) => void;
    onApproveCharge: (item: any) => void;
    onViewReceipt: (url: string) => void;
    onViewNotes: (notes: string) => void;
    token: string;
    onActionSuccess: () => void;
}

const ReturnsTable = ({
    data,
    isLoading,
    onResendLink,
    onApproveCharge,
    onViewReceipt,
    onViewNotes,
    token,
    onActionSuccess,
}: ReturnsTableProps) => {
    return (
        <div className="w-full">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Booking</TableHead>
                        <TableHead className="font-semibold text-gray-700">Dress</TableHead>
                        <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700">Lender</TableHead>
                        <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Overdue</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Method</TableHead>
                        <TableHead className="font-semibold text-gray-700">Tracking</TableHead>
                        <TableHead className="font-semibold text-gray-700">Fee</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                {[...Array(11)].map((_, j) => (
                                    <TableCell key={j}>
                                        <div className="h-4 bg-gray-100 animate-pulse rounded" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="h-32 text-center text-gray-500">
                                No returns requiring attention found
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <ReturnRow
                                key={item.bookingId}
                                item={item}
                                onResendLink={onResendLink}
                                onApproveCharge={onApproveCharge}
                                onViewReceipt={onViewReceipt}
                                onViewNotes={onViewNotes}
                                token={token}
                                onActionSuccess={onActionSuccess}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ReturnsTable;
