import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";

interface ReceiptModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

const ReceiptModal = ({ isOpen, imageUrl, onClose }: ReceiptModalProps) => {
    if (!imageUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none bg-black/5">
                <DialogHeader className="p-6 bg-white border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        Return Receipt
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-center p-4 bg-gray-50 min-h-[300px] max-h-[70vh] overflow-auto">
                    <Image
                        src={imageUrl}
                        alt="Return Receipt"
                        width={600}
                        height={800}
                        className="rounded-lg shadow-lg max-w-full h-auto object-contain"
                        unoptimized
                    />
                </div>

                <DialogFooter className="p-4 bg-white border-t flex gap-3">
                    <Button asChild variant="outline" className="flex-1">
                        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Original
                        </a>
                    </Button>
                    <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                        <a href={imageUrl} download="receipt.jpg">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReceiptModal;
