import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import ListingDetailsContainer from "./_component/listing-details-container";

export default async function ListingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const cu = await auth();

  if (!cu || !cu?.user?.accessToken) redirect("/login");
  // Handle error state
  if (false) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            Something went wrong!
          </h2>
          <p className="text-red-600 mb-6">
            We encountered an error while loading the listing details. Please
            try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (false) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#891d33]"></div>
      </div>
    );
  }

  if (false) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">
            Listing Not Found
          </h2>
          <p className="text-yellow-600 mb-6">
            The listing you&apoch;re looking for doesn&apoch;t exist or has been
            removed.
          </p>
          <Link href="/listings">
            <button className="px-4 py-2 bg-[#891d33] text-white rounded-md hover:bg-[#732032] transition-colors">
              Back to Listings
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ListingDetailsContainer listingId={id} token={cu.user.accessToken} />
    </>
  );
}
