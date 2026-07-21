import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ListingDetailsContainer from "./_components/listing-details-container";

const Page = async ({ params }: { params: { listingId: string } }) => {
  const { listingId } = params;
  const cu = await auth();

  if (!cu || !cu.user.accessToken) redirect("/sign-in");
  return (
    <div>
      <ListingDetailsContainer
        listingId={listingId}
        token={cu.user.accessToken}
      />
    </div>
  );
};

export default Page;
