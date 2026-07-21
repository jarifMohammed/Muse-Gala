"use client";

import { Button } from "@/components/ui/button";

interface ListingBtnSectionProps {
  isSiteListings: "main" | "lender";
  setIsSiteListings: (v: "main" | "lender") => void;
}

export default function ListingBtnSection({
  isSiteListings,
  setIsSiteListings,
}: ListingBtnSectionProps) {
  return (
    <div className="flex items-center gap-8 bg-white px-6 py-8 shadow-md rounded-lg">
      {/* Main Site Listings Button */}
      <Button
        onClick={() => setIsSiteListings("main")}
        className={`border hover:text-white ${
          isSiteListings === "main"
            ? "bg-black text-white border-black"
            : "bg-white text-black border-black"
        }`}
      >
        Main Site Listings
      </Button>

      {/* Lender Listings Button */}
      <Button
        onClick={() => setIsSiteListings("lender")}
        className={`border hover:text-white ${
          isSiteListings === "lender"
            ? "bg-black text-white border-black"
            : "bg-white text-black border-black"
        }`}
      >
        Lender Listings
      </Button>
    </div>
  );
}
