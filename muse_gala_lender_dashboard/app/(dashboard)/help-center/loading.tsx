export default function HelpCenterLoadingPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="h-7 w-36 bg-gray-300 rounded animate-pulse mb-8"></div>

      <div className="mb-8 animate-pulse">
        <div className="h-10 w-full max-w-3xl bg-gray-200 rounded-md"></div>
      </div>

      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="h-5 w-28 bg-gray-300 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded"></div>
            </div>
            <div className="p-4 space-y-4">
              {Array.from({ length: i === 0 ? 3 : 0 }).map((_, j) => (
                <div key={j} className="border-b last:border-b-0 py-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-64 bg-gray-300 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </div>
                  {j === 0 && (
                    <div className="mt-2">
                      <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-5/6 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-4/6 bg-gray-200 rounded"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-sm p-6">
        <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mb-6"></div>

        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-5 w-24 bg-gray-300 rounded mb-1"></div>
            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
          </div>

          <div className="animate-pulse">
            <div className="h-5 w-24 bg-gray-300 rounded mb-1"></div>
            <div className="h-32 w-full bg-gray-200 rounded-md"></div>
          </div>

          <div className="animate-pulse">
            <div className="h-5 w-40 bg-gray-300 rounded mb-1"></div>
            <div className="flex items-center">
              <div className="flex-1 h-10 bg-gray-200 rounded-l-md"></div>
              <div className="h-10 w-32 bg-gray-300 rounded-r-md"></div>
            </div>
          </div>

          <div className="w-36 h-10 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
