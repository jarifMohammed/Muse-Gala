import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LenderHeader from "./_components/lender-header";
import LenderSearchHeader from "./_components/lender-search-header";
import LenderTableContainer from "./_components/lender-table-container";

const Page = async () => {
  const cu = await auth();
  if (!cu?.user) redirect("/sign-in");

  const accessToken = cu.user.accessToken;

  return (
    <div className="space-y-[30px]">
      <LenderHeader />
      <LenderSearchHeader />
      <LenderTableContainer accessToken={accessToken} />
    </div>
  );
};

export default Page;
