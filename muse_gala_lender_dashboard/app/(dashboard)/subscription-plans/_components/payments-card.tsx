import React from "react";

interface Profile {
  hasActiveSubscription: boolean;
  stripeOnboardingCompleted: boolean;
  totalReveneue: string;
  subscriptionStartDate?: string;
  subscriptionExpireDate?: string;
  subscription?: {
    planId?: {
      _id: string;
      name: string;
    };
  };
}

interface Props {
  profile: Profile;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const PaymentsCard = ({ profile }: Props) => {
  return (
    <div
      className={`p-4 sm:p-5 rounded-lg shadow-[0px_4px_10px_0px_#0000001A] transition-all duration-300 ${profile?.hasActiveSubscription
          ? "bg-primary text-white"
          : "bg-white"
        }`}
    >
      <p className="text-xs sm:text-sm uppercase tracking-wider opacity-70 mb-2">Current Subscription</p>
      <p className="font-semibold text-xl sm:text-2xl">
        {profile?.subscription?.planId?.name || "No Active Plan"}
      </p>
      {profile?.hasActiveSubscription && (
        <div className="mt-3 space-y-1 border-t border-white/20 pt-3">
          <p className="text-xs opacity-80">
            <span className="font-medium">Start:</span> {formatDate(profile.subscriptionStartDate)}
          </p>
          <p className="text-xs opacity-80">
            <span className="font-medium">Expires:</span> {formatDate(profile.subscriptionExpireDate)}
          </p>
        </div>
      )}
      {!profile?.hasActiveSubscription && (
        <p className="mt-2 text-sm text-gray-400 italic">Subscribe to a plan below</p>
      )}
    </div>
  );
};

export default PaymentsCard;
