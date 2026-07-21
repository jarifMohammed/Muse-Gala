"use client";
import { X } from "lucide-react";
import Image from "next/image";
import type { Dress } from "@/types/listings";
import modalImg from "../public/mIcon.png";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dress: Dress | null;
  newStatus: boolean;
}

export function StatusModal({
  isOpen,
  onClose,
  onConfirm,
  dress,
  newStatus,
}: StatusModalProps) {
  if (!isOpen || !dress) return null;

  const statusText = newStatus ? "Turned On" : "Turned Off";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-[15px] shadow-xl w-full max-w-3xl p-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center justify-center mx-auto">
            {/* <span className="text-[#891d33] text-4xl font-serif italic text-center">𝓜</span> */}
            <Image
              src={modalImg}
              alt="Logo"
              width={220}
              height={220}
              className="w-[70px] h-[60px] object-cover"
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <h2 className="text-2xl font-medium mb-4 text-center">
          Listing {statusText}
        </h2>

        <p className="text-center text-sm text-black mb-[60px]">
          {newStatus
            ? "This listing will now be visible to customers and available for booking."
            : "This listing will automatically reactivate when you turn the toggle back on."}
        </p>

        {/* <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-60">
              <Image
                src={dress.image || "/placeholder.svg"}
                alt={dress.name}
                fill
                className="object-cover rounded-lg"
                sizes="160px"
              />
            </div>
            <div className="bg-[#FEFAF6] flex-1 h-60 pl-5 ">
              <h3 className="font-bold text-lg">
                {dress.brand} - {dress.name}
              </h3>
              <p className="text-sm">Product ID: {dress.id}</p>
              <p className="text-sm">Size: {dress.size}</p>
              <p className="text-sm">Color: {dress.color}</p>
              <p className="text-sm">Condition: {dress.condition}</p>
              <p className="text-sm">Rental Price: {dress.price}</p>
              <p className="text-sm">Last Updated: {dress.lastUpdated}</p>
              <p className="text-sm">
                Status: {newStatus ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div> */}


        <div className="mb-8">
  <div className="flex items-center justify-center">
    <div className="relative w-40 h-60">
      <Image
        src={dress.image || "/placeholder.svg"}
        alt={dress.name}
        fill
        className="object-cover rounded-l-lg"
        sizes="160px"
      />
    </div>

    <div className="bg-[#FEFAF6] flex-1 h-60 pl-5 flex flex-col justify-center space-y-2 rounded-r-lg">
      <h3 className="font-bold text-lg">
        {dress.brand} - {dress.name}
      </h3>
      <p className="text-sm">Product ID: {dress.id}</p>
      <p className="text-sm">Size: {dress.size}</p>
      <p className="text-sm">Color: {dress.color}</p>
      <p className="text-sm">Condition: {dress.condition}</p>
      <p className="text-sm">Rental Price: {dress.price}</p>
      <p className="text-sm">Last Updated: {dress.lastUpdated}</p>
      <p className="text-sm">
        Status: {newStatus ? "Active" : "Inactive"}
      </p>
    </div>
  </div>
</div>


        <div className="flex gap-[30px] justify-center">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#7a1832]"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
