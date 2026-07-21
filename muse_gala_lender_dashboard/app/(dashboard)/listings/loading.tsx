import { SkeletonStatCard, SkeletonTable } from "@/components/ui/skeletons";

export default function ListingsLoadingPage() {
  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-7 w-48 bg-gray-300 rounded animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-40 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 animate-pulse">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-40 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <SkeletonTable rows={3} columns={8} />

          <div className="mt-6 flex justify-between items-center animate-pulse">
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
