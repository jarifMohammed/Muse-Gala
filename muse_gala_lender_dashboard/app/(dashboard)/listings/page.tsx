import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ListingSearchHeader from "./_components/searchbar/listing-search-header";
import ListingStats from "./_components/stats/listing-stats";
import ListingTableContainer from "./_components/table-container/listing-table-container";

export default async function ListingsPage() {
  const cu = await auth();

  if (!cu || !cu?.user.accessToken) redirect("/login");
  return (
    <>
      <div className="p-4 sm:p-6 md:p-8 bg-[#fefaf6] space-y-4 sm:space-y-6">
        <ListingStats token={cu.user.accessToken} />

        <ListingSearchHeader />

        <ListingTableContainer token={cu.user.accessToken} />
      </div>
    </>
  );
}
