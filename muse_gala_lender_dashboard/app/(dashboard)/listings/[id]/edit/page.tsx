import { auth } from "@/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import ListingForm from "../../new/_components/Listing-form";

// Example server fetcher
async function getListing(id: string, token: string) {
  const res = await fetch(`${process.env.API_URL}/listings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // avoid caching if data is dynamic
  });

  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

const Page = async ({ params }: { params: { id: string } }) => {
  const cu = await auth();
  if (!cu || !cu?.user.accessToken) redirect("/login");
  const { id } = await params;

  const queryClient = new QueryClient();

  // prefetch the data server-side
  await queryClient.prefetchQuery({
    queryKey: ["listing", id],
    queryFn: () => getListing(id, cu.user.accessToken),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-8">
        <ListingForm token={cu.user.accessToken} initialId={id} />
      </div>
    </HydrationBoundary>
  );
};

export default Page;
