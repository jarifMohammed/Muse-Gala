'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReturnData } from './types';
import ReturnHeader from './ReturnHeader';
import ReturnInfoBox from './ReturnInfoBox';
import ReturnForm from './ReturnForm';
import ReturnConfirmationView from './ReturnConfirmationView';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ReturnResponse {
    success: boolean;
    message: string;
    data: ReturnData;
}

export default function ReturnPageClient({ token }: { token: string }) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/return/${token}`;

    const { data, isLoading, error, isError, refetch } = useQuery<ReturnResponse>({
        queryKey: ['return-details', token],
        queryFn: async () => {
            const res = await fetch(apiUrl);
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.message || `Status ${res.status}`);
            }
            return json;
        },
        retry: false, // Don't retry on 404/410 errors
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-primary">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="text-lg font-medium">Loading return details</p>
            </div>
        );
    }

    if (isError) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';

        // Check for specific error states based on API response
        const isLinkExpired = errorMsg.includes('expired') || errorMsg.includes('410');
        const isInvalidLink = errorMsg.includes('Invalid') || errorMsg.includes('not found') || errorMsg.includes('404');

        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <AlertCircle className="w-16 h-16 text-destructive mb-6" />
                <h1 className="text-3xl font-bold mb-4">
                    {isLinkExpired ? 'Link Expired' : isInvalidLink ? 'Invalid Link' : 'Error Loading Return'}
                </h1>
                <p className="text-muted-foreground text-center max-w-md mb-8 text-lg">
                    {isLinkExpired
                        ? "This return link has expired because the return timeframe has passed. Please contact support if you believe this is a mistake."
                        : isInvalidLink
                            ? "We couldn't securely verify this link. Please ensure you clicked the exact link provided in your email."
                            : `An error occurred: ${errorMsg}. Please try again later.`}
                </p>
                <Link href="/">
                    <Button size="lg">Return to Home</Button>
                </Link>
            </div>
        );
    }

    if (!data?.data) {
        return null;
    }

    const returnData = data.data;

    return (
        <div className="animate-in fade-in duration-500 pt-32 pb-12 px-4 sm:px-6">
            <ReturnHeader data={returnData} />
            <ReturnInfoBox data={returnData} />

            {returnData.returnConfirmedAt ? (
                <ReturnConfirmationView data={returnData} />
            ) : (
                <ReturnForm
                    token={token}
                    onSuccess={() => refetch()}
                />
            )}
        </div>
    );
}
