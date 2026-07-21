import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface NotesModalProps {
    isOpen: boolean;
    notes: string | null;
    onClose: () => void;
}

const NotesModal = ({ isOpen, notes, onClose }: NotesModalProps) => {
    if (!notes) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-2 text-center">
                    <div className="bg-amber-100 p-3 rounded-full">
                        <FileText className="w-8 h-8 text-amber-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Customer Notes</DialogTitle>
                </DialogHeader>

                <div className="py-6 min-h-[100px] bg-amber-50/30 p-4 rounded-xl border border-amber-100 italic text-gray-700 leading-relaxed">
                    &ldquo;{notes}&rdquo;
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

export default NotesModal;
