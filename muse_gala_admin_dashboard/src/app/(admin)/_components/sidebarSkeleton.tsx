export default function SidebarSkeleton() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-primary p-6">
      <div className="animate-pulse space-y-6">

        {/* Logo skeleton */}
        <div className="mx-auto h-20 w-20 rounded-full bg-white/20" />

        {/* Routes skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-md bg-white/10"
            />
          ))}
        </div>

        {/* Logout skeleton */}
        <div className="mt-6 h-10 rounded-md bg-white/10" />
      </div>
    </div>
  )
}
