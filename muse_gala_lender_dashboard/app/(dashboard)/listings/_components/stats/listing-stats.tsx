"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import { useQuery } from "@tanstack/react-query";

interface Props {
  token: string;
}

interface ApiProps {
  status: boolean;
  message: string;
  data: {
    totalListings: number;
    activeListings: number;
    popularListings: [];
  };
}

const ListingStats = ({ token }: Props) => {
  const { isLoading, data, isError, error } = useQuery<ApiProps>({
    queryKey: ["listing-stats"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/listings/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json()),
  });

  if (isError) {
    return (
      <div className="p-6 bg-red-100 text-red-600 rounded-lg">
        <p>Error loading listing stats.</p>
        <p className="text-sm opacity-75">{(error as Error)?.message}</p>
      </div>
    );
  }
  const stats = data?.data;

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6">
      <SkeletonWrapper isLoading={isLoading}>
        <Card className="bg-[#891d33] h-full">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-white/80 text-[10px] md:text-sm">
              Most Popular Listing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
            <p className="text-xs md:text-xl text-white font-medium text-left truncate">
              {"No listings"}
            </p>
          </CardContent>
        </Card>
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={isLoading}>
        <Card className="bg-white h-full">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-gray-600 text-[10px] md:text-sm">
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
            <p className="text-xl md:text-[25px] text-black font-medium text-left">
              {stats?.totalListings ?? 0}
            </p>
          </CardContent>
        </Card>
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={isLoading}>
        <Card className="bg-white h-full">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-gray-600 text-[10px] md:text-sm">
              Active Listings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
            <p className="text-xl md:text-[25px] text-black font-medium text-left">
              {stats?.activeListings ?? 0}
            </p>
          </CardContent>
        </Card>
      </SkeletonWrapper>
    </div>
  );
};

export default ListingStats;
