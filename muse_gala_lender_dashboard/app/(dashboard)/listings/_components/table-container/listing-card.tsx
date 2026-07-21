"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Listing } from "@/types/listings/index";
import Image from "next/image";
import StatusController from "./status-controller";
import ListingViewAction from "./listing-view-action";
import { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface ListingCardProps {
    listing: Listing;
    token: string;
    table: Table<Listing>;
}

const ListingCard = ({ listing, token, table }: ListingCardProps) => {
    const approvalStatus = listing.approvalStatus;

    const approvalColor: Record<string, string> = {
        approved: "bg-green-100 text-green-700 border border-green-300 capitalize",
        rejected: "bg-red-100 text-red-700 border border-red-300 capitalize",
        pending: "bg-yellow-100 text-yellow-700 border border-yellow-300 capitalize",
    };

    return (
        <Card className="mb-4 overflow-hidden border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all active:scale-[0.98]">
            <CardContent className="p-0">
                <div className="flex p-3.5 gap-4">
                    {/* Thumbnail - Slightly larger for premium feel */}
                    <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden ring-1 ring-gray-100">
                        <Image
                            src={listing.media[0]}
                            alt={listing.dressName}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col py-0.5">
                        <div className="space-y-1.5 flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-gray-900 leading-tight text-base line-clamp-2">
                                    {listing.dressName}
                                </h3>
                                <Badge
                                    className={cn(
                                        "px-2 py-0 h-5 text-[10px] font-semibold border-none shadow-none",
                                        approvalColor[approvalStatus] || "bg-gray-100 text-gray-700 capitalize"
                                    )}
                                >
                                    {approvalStatus}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Brand</span>
                                    <span className="text-xs font-semibold text-gray-700">{listing.brand || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Size</span>
                                    <span className="text-xs font-semibold text-gray-700">{listing.size.join(", ")}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 overflow-hidden">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-[0.05em]">4 Day</span>
                                    <span className="text-xs sm:text-sm font-extrabold text-[#891d33] leading-none">${listing.rentalPrice.fourDays}</span>
                                </div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-[0.05em]">8 Day</span>
                                    <span className="text-xs sm:text-sm font-extrabold text-[#891d33] leading-none">${listing.rentalPrice.eightDays}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                                <div className="scale-[0.7] sm:scale-100 origin-right -ml-3 sm:ml-0">
                                    <StatusController data={listing} />
                                </div>
                                <ListingViewAction data={listing} table={table} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ListingCard;
