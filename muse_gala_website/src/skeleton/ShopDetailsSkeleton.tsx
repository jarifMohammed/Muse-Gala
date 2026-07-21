import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";

const ShopDetailsSkeleton = () => {
  const pathName = usePathname();
  const isCheckout =
    pathName?.startsWith("/shop/checkout") &&
    !pathName.includes("/confirmation");

  if (isCheckout) {
    // Skeleton for checkout order summary
    return (
      <div className="lg:min-h-[660px] font-avenir">
        <Skeleton className="h-6 w-1/3 mb-8" /> {/* Order Summary title */}
        <div className="flex items-start gap-2 mb-6">
          <Skeleton className="w-[150px] h-[150px]" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="mt-16 flex items-center gap-5">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-1/2" />
        </div>
        <div className="mt-6 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // Skeleton for product details page
  return (
    <div className="lg:min-h-[660px] font-avenir">
      <Skeleton className="h-6 w-1/3 mb-4" /> {/* Dress name */}
      <Skeleton className="h-4 w-1/4 mb-6" /> {/* Price */}
      <div className="mt-16 flex items-center gap-5">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-1/2" />
      </div>
      <div className="mt-6 space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
};

export default ShopDetailsSkeleton;
