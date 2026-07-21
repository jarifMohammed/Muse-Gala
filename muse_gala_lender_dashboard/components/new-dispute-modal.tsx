"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FileUpload } from "./file-upload";
import {
  createDispute,
  getBookingsForDropdown,
  getDisputeReasons,
} from "@/services/disputes-service";
import type {
  BookingOption,
  DisputeFormData,
  ReasonOption,
} from "@/types/disputes";

interface NewDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewDisputeModal({
  isOpen,
  onClose,
  onSuccess,
}: NewDisputeModalProps) {
  const [formData, setFormData] = useState<DisputeFormData>({
    bookingId: "",
    reason: "",
    description: "",
    evidence: [],
  });
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [reasons, setReasons] = useState<ReasonOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DisputeFormData, string>>
  >({});
  const [bookingDropdownOpen, setBookingDropdownOpen] = useState(false);
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const bookingsData =
          (await getBookingsForDropdown()) as BookingOption[];
        setBookings(bookingsData);
        setReasons(getDisputeReasons());
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof DisputeFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, evidence: files }));
  };

  const handleSubmit = async () => {
    // Validate form
    const newErrors: Partial<Record<keyof DisputeFormData, string>> = {};

    if (!formData.bookingId) {
      newErrors.bookingId = "Booking ID is required";
    }

    if (!formData.reason) {
      newErrors.reason = "Reason is required";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createDispute(formData);
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating dispute:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bookingId: "",
      reason: "",
      description: "",
      evidence: [],
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-[60px]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-[60px] overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        ></button>

        <div className="p-6 ">
          <div className="flex items-center justify-between">
            <h2 className="text-[32px] mb-[60px] font-normal">
              Submit New Dispute
            </h2>
            <X     onClick={onClose}  className="h-6 w-6 cursor-pointer  mb-[60px] " />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-[25px] text-base font-medium  ">
                Booking ID <span className="text-red-500 ml-[20px]">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2.5 border rounded-lg ${
                    errors.bookingId ? "border-red-500" : "border-gray-300"
                  } flex justify-between items-center`}
                  onClick={() => setBookingDropdownOpen(!bookingDropdownOpen)}
                >
                  <span>
                    {formData.bookingId
                      ? bookings.find((b) => b.id === formData.bookingId)?.id ||
                        formData.bookingId
                      : "Select One"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      bookingDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {bookingDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {bookings.map((booking) => (
                        <li
                          key={booking.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              bookingId: booking.id,
                            }));
                            setBookingDropdownOpen(false);
                            if (errors.bookingId) {
                              setErrors((prev) => ({ ...prev, bookingId: "" }));
                            }
                          }}
                        >
                          {booking.id} - {booking.dressName} (
                          {booking.customerName})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {errors.bookingId && (
                <p className="mt-1 text-sm text-red-500">{errors.bookingId}</p>
              )}
            </div>

            <div>
              <label className="block mb-[25px] text-base font-medium">
                Reason <span className="text-red-500 ml-[20px]">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2.5 border rounded-lg ${
                    errors.reason ? "border-red-500" : "border-gray-300"
                  } flex justify-between items-center`}
                  onClick={() => setReasonDropdownOpen(!reasonDropdownOpen)}
                >
                  <span>
                    {formData.reason
                      ? reasons.find((r) => r.label === formData.reason)
                          ?.label || formData.reason
                      : "Select One"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      reasonDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {reasonDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {reasons.map((reason) => (
                        <li
                          key={reason.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              reason: reason.label,
                            }));
                            setReasonDropdownOpen(false);
                            if (errors.reason) {
                              setErrors((prev) => ({ ...prev, reason: "" }));
                            }
                          }}
                        >
                          {reason.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
              )}
            </div>

            <div>
              <label className="block mb-[15px] text-base font-normal">
                Description <span className="text-red-500  ml-[20px]">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } min-h-[150px]`}
                placeholder="Provide details about the dispute"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-[15px] text-base font-normal">
                Upload Evidence{" "}
                <span className="text-red-500 ml-[20px]">*</span>
              </label>
              <FileUpload
                className=""
                onFileChange={handleFileChange}
                buttonText="Upload File"
                placeholder="File name"
                files={formData.evidence}
              />
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-[30px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[16px] py-[11px] border border-[#891D33] text-[#891D33] rounded-md  hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-[16px] py-[10px] bg-[#8c1c3a] text-[16px] rounded-lg  text-white  hover:bg-[#7a1832] transition-colors disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Dispute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
