import React from 'react';
import Image from 'next/image';
import { ReturnData } from './types';

export default function ReturnHeader({ data }: { data: ReturnData }) {
    return (
        <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Product Image - Smaller and more elegant */}
            {data.dressImage && (
                <div className="w-24 h-24 relative rounded-full overflow-hidden mb-6 ring-2 ring-primary/10 ring-offset-4 bg-muted">
                    <Image
                        src={data.dressImage}
                        alt={data.dressName}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                </div>
            )}

            <div className="space-y-1.5">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">Return Confirmation</p>
                <h1 className="text-xl font-light tracking-tight">Hi {(data.customerName || 'Customer').split(' ')[0]},</h1>
                <p className="text-sm text-muted-foreground">
                    Regarding your rental of <span className="text-foreground font-medium">{data.dressName}</span> by <span className="text-foreground font-medium">{data.brand}</span>
                </p>
            </div>
        </div>
    );
}
