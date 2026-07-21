/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import SummaryStats from "./SummaryStats";
import FiltersRow from "./FiltersRow";
import ReturnsTable from "./ReturnsTable";
import { useGetOverdueSummary, useGetReturnsAttention } from "@/lib/return-api";
import { PaginationControls } from "@/components/ui/pagination-controls";
import ReturnLinkModal from "./modals/ReturnLinkModal";
import ApproveChargeModal from "./modals/ApproveChargeModal";
import ReceiptModal from "./modals/ReceiptModal";
import NotesModal from "./modals/NotesModal";


const ReturnManagement = ({ token }: { token: string }) => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ status: "", daysOverdue: "", method: "", search: "" });

    // Modals state
    const [linkModal, setLinkModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
    const [chargeModal, setChargeModal] = useState<{ open: boolean; item: any }>({ open: false, item: null });
    const [receiptModal, setReceiptModal] = useState<{ open: boolean; url: string | null }>({ open: false, url: null });
    const [notesModal, setNotesModal] = useState<{ open: boolean; notes: string | null }>({ open: false, notes: null });

    const { data: summary, refetch: refetchSummary } = useGetOverdueSummary(token);
    const { data: returnsData, isLoading, refetch: refetchReturns } = useGetReturnsAttention(token, page, 20);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredReturns = (returnsData?.data || []).filter((item: any) => {
        if (filters.status && item.currentStatus !== filters.status) return false;
        if (filters.method && item.returnMethod !== filters.method) return false;

        // Days overdue filtering logic
        if (filters.daysOverdue) {
            const days = item.daysOverdue;
            if (filters.daysOverdue === "1-3" && (days < 1 || days > 3)) return false;
            if (filters.daysOverdue === "4-7" && (days < 4 || days > 7)) return false;
            if (filters.daysOverdue === "8-14" && (days < 8 || days > 14)) return false;
            if (filters.daysOverdue === "15+" && days < 15) return false;
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            if (
                !item.customerName.toLowerCase().includes(search) &&
                !item.customerEmail.toLowerCase().includes(search) &&
                !item.bookingId.toLowerCase().includes(search)
            ) {
                return false;
            }
        }
        return true;
    });

    const refreshData = () => {
        refetchSummary();
        refetchReturns();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight uppercase">Return Management</h1>
            </div>

            <SummaryStats data={summary} />

            <FiltersRow onFilterChange={handleFilterChange} />

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <ReturnsTable
                    data={filteredReturns}
                    isLoading={isLoading}
                    onResendLink={(data) => setLinkModal({ open: true, data })}
                    onApproveCharge={(item) => setChargeModal({ open: true, item })}
                    onViewReceipt={(url) => setReceiptModal({ open: true, url })}
                    onViewNotes={(notes) => setNotesModal({ open: true, notes })}
                    token={token}
                    onActionSuccess={refreshData}
                />
            </div>

            {returnsData?.pagination && (
                <PaginationControls
                    currentPage={page}
                    totalPages={returnsData.pagination.totalPages}
                    totalItems={returnsData.pagination.totalItems}
                    itemsPerPage={20}
                    onPageChange={setPage}
                />
            )}

            {/* Modals */}
            <ReturnLinkModal
                isOpen={linkModal.open}
                data={linkModal.data}
                onClose={() => setLinkModal({ open: false, data: null })}
            />

            <ApproveChargeModal
                isOpen={chargeModal.open}
                item={chargeModal.item}
                token={token}
                onClose={() => setChargeModal({ open: false, item: null })}
                onSuccess={refreshData}
            />

            <ReceiptModal
                isOpen={receiptModal.open}
                imageUrl={receiptModal.url}
                onClose={() => setReceiptModal({ open: false, url: null })}
            />

            <NotesModal
                isOpen={notesModal.open}
                notes={notesModal.notes}
                onClose={() => setNotesModal({ open: false, notes: null })}
            />
        </div>
    );
};

export default ReturnManagement;
