import React from "react";

const PaymentsCard = ({ profile }: { profile: any }) => {
  const isOnboarded = profile?.stripeOnboardingCompleted;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-white p-6 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] transition-all duration-300">
        <h1 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">
          {isOnboarded ? "Payment Method Added" : "Stripe Status"}
        </h1>

        {isOnboarded ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Account ID</span>
              <span className="font-medium">{profile?.stripeAccountId || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Charges Enabled</span>
              <span className={profile?.chargesEnabled ? "text-green-600 font-semibold" : "text-red-500"}>
                {profile?.chargesEnabled ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Payouts Enabled</span>
              <span className={profile?.payoutsEnabled ? "text-green-600 font-semibold" : "text-red-500"}>
                {profile?.payoutsEnabled ? "Yes" : "No"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p className="text-gray-400 italic">No payment method connected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsCard;
