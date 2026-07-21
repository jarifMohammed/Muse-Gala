import React from "react";
import { Booking } from "../bookings-modal";

const BookingPayment = ({ bookingDetails }: { bookingDetails?: Booking }) => {
  return (
    <div className="mt-5 space-y-5">
      <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
        <h1 className="text-xl mb-4 font-medium tracking-wide">Customer Payment</h1>

        <div className="text-sm space-y-3 font-sans">
          <p className="flex justify-between border-b pb-2 border-slate-100">
            <span className="text-slate-500">Transaction ID:</span>
            <span className="font-semibold text-slate-800">{bookingDetails?.stripePaymentIntentId || "N/A"}</span>
          </p>
          <p className="flex justify-between border-b pb-2 border-slate-100">
            <span className="text-slate-500">Amount Paid:</span>
            <span className="font-semibold text-slate-800">${bookingDetails?.totalAmount}</span>
          </p>
          <p className="flex justify-between border-b pb-2 border-slate-100">
            <span className="text-slate-500">Payment Status:</span>
            <span className={`font-semibold capitalize ${bookingDetails?.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
              {bookingDetails?.paymentStatus}
            </span>
          </p>

        </div>
      </div>

      {bookingDetails?.payouts && bookingDetails.payouts.length > 0 && (
        <div className="border border-gray-200 p-5 rounded-lg shadow-sm">
          <h1 className="text-xl mb-4 font-medium tracking-wide">Lenders Payout Details</h1>

          <div className="space-y-6">
            {bookingDetails.payouts.map((payout, idx) => (
              <div key={payout._id || idx} className="text-sm space-y-3 font-sans border-b last:border-0 pb-4 last:pb-0">
                <p className="flex justify-between">
                  <span className="text-slate-500">Booking Amount:</span>
                  <span className="font-medium">${payout.bookingAmount}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Lender Price:</span>
                  <span className="font-medium">${payout.lenderPrice}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Commission ({payout.commission}%):</span>
                  <span className="font-medium">-${(payout.lenderPrice - payout.requestedAmount).toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Requested Payout:</span>
                  <span className="font-medium">${payout.requestedAmount}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Payout Status:</span>
                  <span className={`font-semibold capitalize ${payout.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                    {payout.status}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Requested At:</span>
                  <span className="text-slate-600">
                    {new Date(payout.requestedAt).toLocaleDateString()} {new Date(payout.requestedAt).toLocaleTimeString()}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPayment;
