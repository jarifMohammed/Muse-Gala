"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/zustand/useUserStore";

export function SupportForm() {
    const [subject, setSubject] = useState("");
    const [issueType, setIssueType] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");

    const user = useUserStore((state) => state.user);
    const token = user?.accessToken;
    const lenderId = user?.id;

    const resetForm = () => {
        setSubject("");
        setIssueType("");
        setMessage("");
        setFile(null);
        setFileName("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const supportMutation = useMutation({
        mutationFn: async () => {
            if (!token) throw new Error("Authentication required");
            if (!lenderId) throw new Error("User profile not found");

            const formData = new FormData();
            formData.append("lenderId", lenderId);
            formData.append("subject", subject);
            formData.append("issueType", issueType);
            formData.append("message", message);
            if (file) {
                formData.append("file", file);
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/support/lender`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || "Failed to send message");
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("Support request sent successfully!");
            resetForm();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim()) return toast.error("Please enter a subject");
        if (!issueType) return toast.error("Please select an issue type");
        if (!message.trim()) return toast.error("Please enter your message");

        supportMutation.mutate();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                        id="subject"
                        placeholder="What is this about?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={supportMutation.isPending}
                        className="h-12 border-[#E6E6E6] rounded-[10px] text-sm md:text-base"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="issueType">Issue Type *</Label>
                    <Select
                        value={issueType}
                        onValueChange={setIssueType}
                        disabled={supportMutation.isPending}
                    >
                        <SelectTrigger id="issueType" className="h-12 border-[#E6E6E6] rounded-[10px] text-sm md:text-base">
                            <SelectValue placeholder="Select Issue Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Payout">Payout Issue</SelectItem>
                            <SelectItem value="Technical">Technical Issue</SelectItem>
                            <SelectItem value="Listing">Listing Issue</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] md:min-h-[150px] resize-none border-[#E6E6E6] rounded-[10px] text-sm md:text-base"
                    disabled={supportMutation.isPending}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-end">
                <div className="space-y-2 flex-1 w-full">
                    <Label htmlFor="file-upload">Attachment (Optional)</Label>
                    <div className="flex h-12">
                        <Input
                            readOnly
                            placeholder="No file chosen"
                            value={fileName}
                            className="rounded-r-none h-full border-[#E6E6E6] text-xs md:text-sm flex-1"
                        />
                        <div className="relative">
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={supportMutation.isPending}
                            />
                            <Button
                                type="button"
                                className="bg-[#54051d] hover:bg-[#400416] text-white h-full px-4 md:px-6 rounded-l-none text-xs md:text-sm whitespace-nowrap"
                                disabled={supportMutation.isPending}
                            >
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="bg-[#54051d] hover:bg-[#400416] text-white px-10 h-12 rounded-[10px] w-full md:w-auto text-sm md:text-base font-medium"
                    disabled={supportMutation.isPending}
                >
                    {supportMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
            </div>
        </form>
    );
}
