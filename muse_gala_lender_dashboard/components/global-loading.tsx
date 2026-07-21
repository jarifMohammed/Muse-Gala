"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Reset loading state when route changes
    setIsLoading(false)
  }, [pathname, searchParams])

  return isLoading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-[#8c1c3a] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div
          className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-t-transparent border-r-[#8c1c3a] border-b-transparent border-l-transparent animate-spin"
          style={{ animationDirection: "reverse" }}
        ></div>
      </div>
    </div>
  ) : null
}
