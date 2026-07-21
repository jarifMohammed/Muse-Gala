import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ListingForm from "./_components/Listing-form";

const Page = async () => {
  const cu = await auth();
  if (!cu || !cu?.user.accessToken) redirect("/login");

  return (
    <div className="p-4 sm:p-8">
      <ListingForm token={cu.user.accessToken} />
    </div>
  );
};

export default Page;
