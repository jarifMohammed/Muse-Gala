"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2 } from "lucide-react";

interface Subscription {
    _id: string;
    name: string;
    commission: number;
    description: string;
    price: number;
    currency: string;
    billingCycle: string;
    isActive: boolean;
    features: string[];
}

interface Props {
    token: string;
}

const SubscriptionPlanDetails = ({ token }: Props) => {
    const params = useParams();
    const id = params.id;

    const { data: plan, isLoading } = useQuery<Subscription>({
        queryKey: ["subscription-plan", id],
        queryFn: async () => {
            // Trying to fetch all and find the one since get-single endpoint is unknown
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subscription/get-all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const json = await res.json();
            return json.data.find((p: Subscription) => p._id === id);
        },
        enabled: !!token && !!id,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-32 w-full rouned-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!plan) {
        return <div className="text-center py-10">Subscription plan not found.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-[0px_4px_10px_0px_#0000001A]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#891D33] mb-2">{plan.name}</h1>
                        <p className="text-gray-500 max-w-2xl">{plan.description}</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-sm">
                        {plan.isActive ? "Active Plan" : "Inactive"}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-t border-b border-gray-100">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Price</p>
                        <p className="text-2xl font-semibold">{plan.currency} {plan.price}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Commission</p>
                        <p className="text-2xl font-semibold">{plan.commission}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Billing Cycle</p>
                        <p className="text-2xl font-semibold uppercase">{plan.billingCycle}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        Features & Benefits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plan.features?.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-gray-700 font-avenirNormal">{feature}</span>
                            </div>
                        ))}
                        {(!plan.features || plan.features.length === 0) && (
                            <p className="text-gray-500 italic">No specific features listed for this plan.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlanDetails;
