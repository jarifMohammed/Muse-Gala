"use client";

import React from "react";
import Image from "next/image";
import BookingDetailsSkeleton from "./booking-details-skeleton";

type BookingDetails = {
    returnMethod?: string;
    returnNotes?: string;
    returnConfirmedAt?: string;
    returnTrackingNumber?: string;
    returnReceiptPhoto?: string;
    returnDroppedOffAt?: string;
};

type AboutReturnProps = {
    bookingDetails?: BookingDetails;
    isLoading?: boolean;
};

const AboutReturn: React.FC<AboutReturnProps> = ({
    bookingDetails,
    isLoading,
}) => {
    if (isLoading) {
        return <BookingDetailsSkeleton />;
    }

    const isExpress = bookingDetails?.returnMethod === "ExpressShipping";
    const isLocal = bookingDetails?.returnMethod === "LocalDropOff";

    return (
        <div className="bg-white p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A]">
            <div>
                <h1 className="text-xl font-medium break-all">Return Details</h1>
            </div>

            <div className="mt-4 space-y-2 text-sm">
                <h1>
                    Method: <span className="font-semibold">{bookingDetails?.returnMethod ? bookingDetails.returnMethod.replace(/([A-Z])/g, ' $1').trim() : "N/A"}</span>
                </h1>

                <h1 className="break-all">
                    Confirmed At:{" "}
                    <span className="font-semibold">
                        {bookingDetails?.returnConfirmedAt
                            ? new Date(bookingDetails.returnConfirmedAt).toLocaleString()
                            : "N/A"}
                    </span>
                </h1>

                <h1 className="break-all">
                    Tracking Number: <span className="font-semibold">{bookingDetails?.returnTrackingNumber ?? "N/A"}</span>
                </h1>

                <h1>
                    Dropped Off At:{" "}
                    <span className="font-semibold">
                        {bookingDetails?.returnDroppedOffAt
                            ? new Date(bookingDetails.returnDroppedOffAt).toLocaleString()
                            : "N/A"}
                    </span>
                </h1>

                <h1>
                    Notes: <span className="font-semibold">{bookingDetails?.returnNotes || "N/A"}</span>
                </h1>

                {bookingDetails?.returnReceiptPhoto && (
                    <div className="mt-3">
                        <h1 className="mb-2">Receipt Photo:</h1>
                        <div className="relative h-40 w-full border rounded-md overflow-hidden bg-gray-50">
                            <Image
                                src={bookingDetails.returnReceiptPhoto}
                                alt="Return Receipt"
                                fill
                                className="object-contain"
                                unoptimized // In case it's a direct URL from storage
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutReturn;
