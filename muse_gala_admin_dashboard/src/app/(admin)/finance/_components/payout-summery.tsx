/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import FinanceCard from "./finance-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PayoutDetailModal from "./payout-detail-modal";

interface PerLender {
  _id: string;
  name: string;
  email: string;
  totalRevenue: string;
  totalPaid: string;
  pendingPayout: string;
  avgPayout: string;
  totalRequests: string;
}

interface Global {
  totalRevenue?: string;
  totalPaid?: string;
  totalPending?: string;
  avgPayout?: string;
}

interface LendersPayout {
  perLender: PerLender[];
  global?: Global;
}

interface Payouts {
  _id: string;
  lenderId: string;
  bookingId: string;
  bookingAmount: string;
  lenderPrice: string;
  requestedAmount: string;
  commission: string;
  status: string;
  requestedAt: string;
}

interface PendingLenders {
  data: { payouts: Payouts[] };
}

const PayoutSummery = ({ token }: { token: string }) => {
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: lendersPayout } = useQuery<LendersPayout>({
    queryKey: ["lenders-payout"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/overview/dashboard/finance/payout/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data;
    },
    enabled: !!token,
  });

  const { data: pendingPayouts } = useQuery<PendingLenders>({
    queryKey: ["pending-payouts"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/all-payouts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      return data;
    },
    enabled: !!token,
  });

  const transferMutation = useMutation({
    mutationFn: async (payoutId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payout/transfer/${payoutId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || error.error || "Transfer failed");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Payout transferred successfully!");
      queryClient.invalidateQueries({ queryKey: ["pending-payouts"] });
      queryClient.invalidateQueries({ queryKey: ["lenders-payout"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to transfer payout", { duration: 4000 });
    },
  });

  const handleTransfer = (payoutId: string) => {
    if (
      window.confirm(
        "Are you sure you want to transfer this payout to the lender?"
      )
    ) {
      transferMutation.mutate(payoutId);
    }
  };

  const handleView = (payoutId: string) => {
    setSelectedPayoutId(payoutId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-8">
        <FinanceCard
          title="Total Paid"
          value={lendersPayout?.global?.totalPaid as string}
        />
        <FinanceCard
          title="Pending Payouts"
          value={lendersPayout?.global?.totalPending as string}
        />
        <FinanceCard
          title="Average Payout"
          value={lendersPayout?.global?.avgPayout as string}
        />
      </div>

      {/* lenders payout */}
      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg">
        <h1 className="text-2xl font-medium mb-8">Lenders Payout</h1>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Total Revenue</TableHead>
                <TableHead className="text-center">Pending Payout</TableHead>
                <TableHead className="text-center">Avg Payout</TableHead>
                <TableHead className="text-center">Total Requests</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {lendersPayout?.perLender?.map((item) => (
                <TableRow key={item?._id} className="text-center">
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.email}</TableCell>
                  <TableCell>$ {item?.totalRevenue || "0"}</TableCell>
                  <TableCell>$ {item?.pendingPayout}</TableCell>
                  <TableCell>$ {item?.avgPayout}</TableCell>
                  <TableCell>{item?.totalRequests}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* pending payouts */}
      <div className="bg-white shadow-[0px_4px_10px_0px_#0000001A] p-5 rounded-lg">
        <h1 className="text-2xl font-medium mb-8">Pending Payouts</h1>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Lender ID</TableHead>
                <TableHead className="text-center">Booking ID</TableHead>
                <TableHead className="text-center">Booking Amount</TableHead>
                <TableHead className="text-center">Requested Amount</TableHead>
                <TableHead className="text-center">Lender Price</TableHead>
                <TableHead className="text-center">Commission</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pendingPayouts?.data?.payouts?.map((item) => (
                <TableRow key={item?._id} className="text-center">
                  <TableCell className="font-mono text-xs">
                    {item?.lenderId}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {item?.bookingId}
                  </TableCell>
                  <TableCell>$ {item?.bookingAmount || "0"}</TableCell>
                  <TableCell>$ {item?.requestedAmount || "0"}</TableCell>
                  <TableCell>$ {item?.lenderPrice || "0"}</TableCell>
                  <TableCell>{item?.commission || "0"}%</TableCell>
                  <TableCell>
                    <span
                      className={`py-1 px-2 font-medium rounded-md text-xs ${item?.status === "pending"
                        ? "bg-orange-200 text-orange-800"
                        : ""
                        } ${item?.status === "approved"
                          ? "bg-blue-200 text-blue-800"
                          : ""
                        } ${item?.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : ""
                        } ${item?.status === "paid"
                          ? "bg-green-200 text-green-800"
                          : ""
                        }`}
                    >
                      {item?.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(item._id)}
                        className="py-1 px-3 text-xs font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        View
                      </button>
                      {item?.status === "pending" && (
                        <button
                          onClick={() => handleTransfer(item._id)}
                          disabled={transferMutation.isPending}
                          className="py-1 px-3 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-50"
                        >
                          {transferMutation.isPending
                            ? "..."
                            : "Transfer"}
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Payout Detail Modal */}
      <PayoutDetailModal
        payoutId={selectedPayoutId}
        token={token}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayoutId(null);
        }}
      />
    </div>
  );
};

export default PayoutSummery;

