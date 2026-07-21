export function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="overflow-hidden mb-4 aspect-[2/3] w-full relative bg-gray-200"></div>
      <div className="text-center space-y-2 mt-auto">
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex">
          <div className="w-full flex flex-col h-full">
            <ProductSkeleton />
          </div>
        </div>
      ))}
    </div>
  )
}
