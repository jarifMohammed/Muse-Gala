"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import LenderListingContainer from "./lender-listing-container/lender-listing-container";
import ListingBtnSection from "./ListingBtnSection";
import ListingHeader from "./ListingHeader";
import MainListingContainer from "./main-listing-container/MainLisitngContainer";

interface ListingsClientProps {
  accessToken?: string;
}

export default function ListingsClient({ accessToken }: ListingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read tab from URL (default: "main")
  const currentTab = (searchParams.get("tab") as "main" | "lender") || "main";

  const [isSiteListings, setIsSiteListings] = useState<"main" | "lender">(
    currentTab
  );

  // Keep state in sync with URL changes
  useEffect(() => {
    if (currentTab !== isSiteListings) {
      setIsSiteListings(currentTab);
    }
  }, [currentTab, isSiteListings]);

  const onTabChange = (value: "main" | "lender") => {
    setIsSiteListings(value);

    // Update URL with new search param without full reload
    const newUrl = `?tab=${value}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="space-y-[30px]">
      <ListingHeader />
      <ListingBtnSection
        isSiteListings={isSiteListings}
        setIsSiteListings={onTabChange}
      />

      {/* Conditional rendering based on state */}
      {isSiteListings === "main" ? (
        <MainListingContainer accessToken={accessToken as string} />
      ) : (
        <LenderListingContainer accessToken={accessToken as string} />
      )}
    </div>
  );
}
