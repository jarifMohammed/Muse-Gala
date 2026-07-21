/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReturnLinkModalProps {
    isOpen: boolean;
    data: any;
    onClose: () => void;
}

const ReturnLinkModal = ({ isOpen, data, onClose }: ReturnLinkModalProps) => {
    if (!data) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(data.returnUrl);
        toast.success("Link copied to clipboard");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-2">
                    <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Return Link Generated</DialogTitle>
                    <p className="text-gray-500 text-center text-sm">
                        The link has been generated and is ready to be shared with the customer.
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                value={data.returnUrl}
                                readOnly
                                className="pr-10 bg-gray-50 border-gray-200"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-md transition-all"
                            >
                                <Copy className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                        <Button onClick={copyToClipboard} className="bg-primary hover:bg-primary/90">
                            Copy
                        </Button>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex flex-col gap-1">
                        <span className="text-xs font-semibold text-amber-700 uppercase">Expires At</span>
                        <span className="text-sm text-amber-900">{formatDate(data.expiresAt)}</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="w-full">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReturnLinkModal;
