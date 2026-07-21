/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import BookingSnapShot from "./modals/booking-snapshot";
import DisputesDetails from "./modals/disputes-details";
import PlatformPolicyFlags from "./modals/platform-policy-flags";
import { useQuery } from "@tanstack/react-query";
import Refund from "./modals/refund";
import ResolutionPanel from "./modals/resolution-panel";
import ChargeDispute from "./modals/charge-dispute";

interface DisputesModalProps {
  id: string | null;
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

const DisputesModal = ({ id, token, isOpen, onClose }: DisputesModalProps) => {
  const [activeTab, setActiveTab] = useState("Booking Snapshot");

  const { data: disputesDetails = {}, isLoading } = useQuery({
    queryKey: ["dispute-details", id],
    queryFn: async () => {
      if (!id) return {};
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/disputes/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      return json.data;
    },
    enabled: !!id && !!token && isOpen,
  });

  const levels = [
    { label: "Booking Snapshot" },
    { label: "Dispute Details" },
    { label: "Platform Policy Flags" },
    { label: "Resolution Panel" },
    { label: "Refund" },
    { label: "Charge" },
  ];

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Image
                src={"/logo.png"}
                alt="logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-xl font-medium text-gray-900">
                  Dispute Details: {id ? `${id}` : "Loading..."}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Review and manage dispute information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center px-6 pt-5">
              {levels.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.label)}
                  className={`pb-4 px-6 font-medium text-sm transition-colors duration-200 relative ${activeTab === item.label
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {item.label}
                  {activeTab === item.label && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="h-[600px] overflow-auto p-6">
            {activeTab === "Booking Snapshot" && (
              <BookingSnapShot
                disputesDetails={disputesDetails}
                isLoading={isLoading}
              />
            )}
            {activeTab === "Dispute Details" && (
              <DisputesDetails
                disputesDetails={disputesDetails}
                isLoading={isLoading}
              />
            )}
            {activeTab === "Platform Policy Flags" && (
              <PlatformPolicyFlags disputeId={id} token={token} />
            )}
            {activeTab === "Resolution Panel" && (
              <ResolutionPanel disputeId={id} token={token} />
            )}
            {activeTab === "Refund" && <Refund />}
            {activeTab === "Charge" && (
              <ChargeDispute disputeId={id} token={token} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DisputesModal;
