import { ProductGridSkeleton } from "./product-skeleton";


export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="h-8 w-40 bg-gray-200 animate-pulse mx-auto mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 animate-pulse mx-auto"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <div className="h-10 w-full bg-gray-200 animate-pulse mb-6"></div>
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-32 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  )
}
