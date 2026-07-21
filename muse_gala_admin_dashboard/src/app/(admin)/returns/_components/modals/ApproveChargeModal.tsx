/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { approveCharge } from "@/lib/return-api";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";

interface ApproveChargeModalProps {
    isOpen: boolean;
    item: any;
    token: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ApproveChargeModal = ({ isOpen, item, token, onClose, onSuccess }: ApproveChargeModalProps) => {
    const [feeType, setFeeType] = useState("lateFee");
    const [amount, setAmount] = useState(item?.suggestedLateFee?.toString() || "");
    const [adminNotes, setAdminNotes] = useState("");
    const [loading, setLoading] = useState(false);

    // Update amount when item changes
    React.useEffect(() => {
        if (item) {
            setAmount(item.suggestedLateFee?.toString() || "");
        }
    }, [item]);

    const handleSubmit = async () => {
        if (!amount || isNaN(parseFloat(amount))) {
            toast.error("Please enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            await approveCharge(token, item.bookingId, {
                feeType,
                amount: parseFloat(amount),
                adminNotes,
            });
            toast.success(`${feeType === 'lateFee' ? 'Late Fee' : 'Replacement Fee'} approved successfully`);
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to approve charge");
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Approve Charge</DialogTitle>
                    <p className="text-gray-500 text-sm">
                        Booking #{item.bookingId.slice(-6).toUpperCase()} - {item.dressName}
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Fee Type</Label>
                        <Select value={feeType} onValueChange={setFeeType}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lateFee">Late Fee</SelectItem>
                                <SelectItem value="replacementFee">Replacement Fee</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Admin Notes (Optional)</Label>
                        <Textarea
                            placeholder="Add internal notes about this charge..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="border-gray-200 min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
                        {loading ? "Processing..." : "Approve Charge"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApproveChargeModal;
