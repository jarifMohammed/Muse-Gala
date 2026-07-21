import { cn } from "@/lib/utils"

export function SkeletonStatCard() {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
      <div className="h-7 w-16 bg-gray-300 rounded"></div>
    </div>
  )
}

export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <div className="py-4 animate-pulse flex items-center space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className={cn("h-4 bg-gray-200 rounded", i === 0 ? "w-16" : i === columns - 1 ? "w-12" : "flex-1")}
        ></div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden">
      <div className="py-3 mb-2">
        <div className="flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className={cn("h-5 bg-gray-300 rounded", i === 0 ? "w-20" : i === columns - 1 ? "w-14" : "flex-1")}
            ></div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} columns={columns} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex items-start p-4 animate-pulse">
      <div className="w-16 h-20 bg-gray-200 rounded-md mr-3"></div>
      <div className="flex-1">
        <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export function SkeletonCalendarGrid() {
  return (
    <div className="grid grid-cols-7 gap-2 animate-pulse">
      {Array.from({ length: 7 }).map((_, dayIndex) => (
        <div key={dayIndex}>
          <div className="h-5 w-10 mx-auto bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, dateIndex) => (
              <div key={dateIndex} className="h-8 bg-gray-200 rounded-sm"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 bg-white rounded-lg shadow-sm animate-pulse", className)}>
      <div className="h-5 w-32 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export function SkeletonAvatar() {
  return <div className="w-10 h-10 rounded-full bg-gray-200"></div>
}

export function SkeletonButton() {
  return <div className="h-9 w-20 bg-gray-300 rounded-md"></div>
}
