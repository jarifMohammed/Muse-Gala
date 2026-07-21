"use client";

import React from "react";
import PayoutButton from "../../_components/payout-button";
import MessageCustomerButton from "@/components/message-customer-button";

interface BookingActionsProps {
    bookingDetails: {
        _id?: string;
        id?: string;
        paymentStatus?: string;
        payoutStatus?: string;
    };
    token: string;
    userID: string;
    isLoading: boolean;
}

const BookingActions = ({ bookingDetails, token, userID, isLoading }: BookingActionsProps) => {
    if (isLoading || !bookingDetails) return null;
    const bookingId = bookingDetails._id || bookingDetails.id;

    if (!bookingId) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <MessageCustomerButton
                bookingId={bookingId}
                accessToken={token}
                className="w-full sm:w-auto"
            />
            <div className="w-full sm:w-auto">
                <PayoutButton
                    paymentStatus={bookingDetails.paymentStatus || ""}
                    payoutStatus={bookingDetails.payoutStatus}
                    id={bookingId}
                    token={token}
                    userID={userID}
                />
            </div>
        </div>
    );
};

export default BookingActions;
