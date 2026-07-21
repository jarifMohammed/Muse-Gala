import React from 'react';
import { format } from 'date-fns';
import { ReturnData } from './types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Package, Truck, CheckCircle2 } from 'lucide-react';

export default function ReturnConfirmationView({ data }: { data: ReturnData }) {
    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'ExpressShipping':
                return <Truck className="w-5 h-5" />;
            case 'LocalDropOff':
                return <Package className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    const getMethodLabel = (method: string) => {
        switch (method) {
            case 'ExpressShipping':
                return 'Express Shipping';
            case 'LocalDropOff':
                return 'Local Drop-Off';
            default:
                return method;
        }
    };

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pt-12 pb-8 px-8 text-center border-b border-gray-50 bg-green-50/20">
                    <div className="mx-auto w-14 h-14 bg-green-100/50 rounded-full flex items-center justify-center mb-6 text-green-600 ring-8 ring-green-50/50">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-2xl font-light tracking-tight text-gray-900">Return confirmed</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-[0.2em] mt-3 text-green-700/70 font-medium">
                        Thank you. Your return process has begun.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 space-y-10">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Method</p>
                            <div className="flex items-center gap-2">
                                <span className="text-primary/70">{getMethodIcon(data.returnMethod || '')}</span>
                                <p className="text-sm font-medium tracking-tight text-gray-700">{getMethodLabel(data.returnMethod || '')}</p>
                            </div>
                        </div>

                        {data.trackingNumber && (
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Tracking</p>
                                <p className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md inline-block">{data.trackingNumber}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Timestamp</p>
                            <p className="text-sm font-medium tracking-tight text-gray-700">
                                {(() => {
                                    try {
                                        if (data.returnConfirmedAt) {
                                            const date = new Date(data.returnConfirmedAt);
                                            if (!isNaN(date.getTime())) {
                                                return format(date, 'MMM d, yyyy · h:mm a');
                                            }
                                        }
                                        return 'N/A';
                                    } catch {
                                        return 'N/A';
                                    }
                                })()}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">Current Status</p>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase tracking-widest font-bold py-1 px-3">
                                {data.currentStatus || 'InTransit'}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50/50 rounded-2xl flex gap-4 border border-gray-100/50">
                        <div className="mt-0.5">
                            <Info size={16} className="text-primary/60" />
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                            The lender will verify your item within <span className="text-gray-900 font-medium">48 hours</span> of arrival.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <p className="mt-8 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.1em]">
                Confirmation ID: {(data._id || '').slice(0, 8).toUpperCase() || 'N/A'}
            </p>
        </div>
    );
}
