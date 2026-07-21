"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Landmark, CheckCircle2, Loader2, ExternalLink, CreditCard, Building2, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
    token: string;
    userID: string;
    userInfo: any;
}

const PayoutSettings = ({ token, userID, userInfo }: Props) => {
    const queryClient = useQueryClient();

    const getProfileData = (userData: any) => {
        if (userData?.data?.user) return userData.data.user;
        if (userData?.user) return userData.user;
        if (userData?.data) return userData.data;
        return userData;
    };

    const profile = getProfileData(userInfo);

    // Initial state matching backend schema: Stripe | Manual, BankTransfer | PayID
    const [preferredMethod, setPreferredMethod] = useState<string>(profile?.payoutSettings?.preferredMethod || "Stripe");
    const [manualMethod, setManualMethod] = useState<string>(profile?.payoutSettings?.manualMethod || "BankTransfer");
    
    // Bank Details
    const [accountName, setAccountName] = useState(profile?.payoutSettings?.bankDetails?.accountName || "");
    const [bsb, setBsb] = useState(profile?.payoutSettings?.bankDetails?.bsb || "");
    const [accountNumber, setAccountNumber] = useState(profile?.payoutSettings?.bankDetails?.accountNumber || "");
    const [bankName, setBankName] = useState(profile?.payoutSettings?.bankDetails?.bankName || "");
    
    // PayID Details
    const [payIDType, setPayIDType] = useState(profile?.payoutSettings?.payIDDetails?.type || "Mobile");
    const [payIDValue, setPayIDValue] = useState(profile?.payoutSettings?.payIDDetails?.value || "");

    useEffect(() => {
        const profileData = getProfileData(userInfo);
        if (profileData?.payoutSettings) {
            setPreferredMethod(profileData.payoutSettings.preferredMethod || "Stripe");
            setManualMethod(profileData.payoutSettings.manualMethod || "BankTransfer");
            setAccountName(profileData.payoutSettings.bankDetails?.accountName || "");
            setBsb(profileData.payoutSettings.bankDetails?.bsb || "");
            setAccountNumber(profileData.payoutSettings.bankDetails?.accountNumber || "");
            setBankName(profileData.payoutSettings.bankDetails?.bankName || "");
            setPayIDType(profileData.payoutSettings.payIDDetails?.type || "Mobile");
            setPayIDValue(profileData.payoutSettings.payIDDetails?.value || "");
        }
    }, [userInfo]);

    const setupStripe = useMutation({
        mutationKey: ["setup-stripe"],
        mutationFn: async (email: string) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/onboard`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to onboard Stripe");
            }

            const json = await res.json();
            return json;
        },
        onSuccess: (res) => {
            toast.success("Redirecting to Stripe...");
            window.location.href = res.data.url;
        },
        onError: (error: any) => {
            toast.error(error?.message || "Something went wrong");
        },
    });

    const updatePayoutSettings = useMutation({
        mutationKey: ["update-payout-settings"],
        mutationFn: async (settings: any) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/${userID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ payoutSettings: settings }),
                }
            );

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update payout settings");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Payout settings updated successfully");
            queryClient.invalidateQueries({ queryKey: ["user-info", userID] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const handleSaveManual = () => {
        const settings = {
            preferredMethod: "Manual",
            manualMethod: manualMethod,
            bankDetails: manualMethod === "BankTransfer" ? {
                accountName,
                bsb,
                accountNumber,
                bankName,
            } : undefined,
            payIDDetails: manualMethod === "PayID" ? {
                type: payIDType,
                value: payIDValue,
            } : undefined,
        };
        updatePayoutSettings.mutate(settings);
    };

    const handleSwitchToStripe = () => {
        updatePayoutSettings.mutate({ preferredMethod: "Stripe" });
    };

    const handleSetupStripe = () => {
        if (profile?.email) {
            setupStripe.mutate(profile.email);
        } else {
            toast.error("User email not found");
        }
    };

    const isOnboarded = profile?.stripeOnboardingCompleted;

    return (
        <div className="p-5 md:p-8 bg-white shadow-[0px_4px_20px_0px_#0000000D] rounded-xl border border-gray-100">
            <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                    <Landmark className="h-5 w-5 md:h-6 md:w-6 text-[#54051d]" />
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">Payout Settings</h2>
                </div>

                <Tabs value={preferredMethod} onValueChange={(val) => setPreferredMethod(val)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-gray-50 p-1 border">
                        <TabsTrigger value="Stripe" className="data-[state=active]:bg-white data-[state=active]:text-[#54051d] data-[state=active]:shadow-sm transition-all h-full font-semibold">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Stripe Connect
                        </TabsTrigger>
                        <TabsTrigger value="Manual" className="data-[state=active]:bg-white data-[state=active]:text-[#54051d] data-[state=active]:shadow-sm transition-all h-full font-semibold">
                            <Building2 className="h-4 w-4 mr-2" />
                            Manual (Bank/PayID)
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="Stripe" className="space-y-6 mt-0">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Stripe Onboarding</h3>
                                    {isOnboarded && (
                                        <span className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 max-w-md">
                                    Connect your Stripe account to receive automated payouts. This is our recommended method for faster and more secure transfers.
                                </p>
                            </div>

                            <div className="w-full xl:w-auto">
                                {isOnboarded ? (
                                    <div className="space-y-3 min-w-0 md:min-w-[300px]">
                                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                                            <span>Stripe Account Details</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-gray-100 space-y-2.5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">ID</span>
                                                <span className="font-mono font-medium text-gray-700">{profile?.stripeAccountId || "—"}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Payouts</span>
                                                <span className={profile?.payoutsEnabled ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                                    {profile?.payoutsEnabled ? "Enabled" : "Disabled"}
                                                </span>
                                            </div>
                                        </div>
                                        {preferredMethod !== "Stripe" && (
                                            <Button 
                                                variant="outline" 
                                                className="w-full mt-2"
                                                onClick={handleSwitchToStripe}
                                                disabled={updatePayoutSettings.isPending}
                                            >
                                                Use Stripe as Preferred
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleSetupStripe}
                                        disabled={setupStripe.isPending}
                                        className="bg-[#54051d] hover:bg-[#400416] text-white w-full sm:min-w-[240px] h-12 shadow-lg shadow-red-900/10 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {setupStripe.isPending ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" />Processing...</>
                                        ) : (
                                            <>Connect Stripe <ExternalLink className="h-4 w-4" /></>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="Manual" className="space-y-6 mt-0">
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">Manual Payout Type</Label>
                                    <Select value={manualMethod} onValueChange={(val) => setManualMethod(val)}>
                                        <SelectTrigger className="w-full md:w-[240px] bg-white h-11">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BankTransfer">Bank Transfer</SelectItem>
                                            <SelectItem value="PayID">PayID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {manualMethod === "BankTransfer" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="accName">Account Name</Label>
                                            <Input id="accName" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="bg-white h-11" placeholder="Enter account name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bankName">Bank Name</Label>
                                            <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} className="bg-white h-11" placeholder="Enter bank name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bsb">BSB (6 digits)</Label>
                                            <Input id="bsb" value={bsb} onChange={(e) => setBsb(e.target.value)} maxLength={6} className="bg-white h-11" placeholder="000-000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="accNum">Account Number</Label>
                                            <Input id="accNum" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="bg-white h-11" placeholder="Enter account number" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>PayID Type</Label>
                                            <Select value={payIDType} onValueChange={(val) => setPayIDType(val)}>
                                                <SelectTrigger className="bg-white h-11">
                                                    <SelectValue placeholder="Select PayID type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Mobile">Mobile Number</SelectItem>
                                                    <SelectItem value="Email">Email Address</SelectItem>
                                                    <SelectItem value="ABN">ABN/ACN</SelectItem>
                                                    <SelectItem value="Organization ID">Organization ID</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="payidVal">PayID Value</Label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input id="payidVal" value={payIDValue} onChange={(e) => setPayIDValue(e.target.value)} className="bg-white h-11 pl-10" placeholder="Enter PayID value" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                                <Button 
                                    onClick={handleSaveManual} 
                                    disabled={updatePayoutSettings.isPending}
                                    className="bg-[#54051d] hover:bg-[#400416] text-white w-full sm:min-w-[240px] h-12 shadow-lg shadow-red-900/10 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {updatePayoutSettings.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Payout Details"}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PayoutSettings;
