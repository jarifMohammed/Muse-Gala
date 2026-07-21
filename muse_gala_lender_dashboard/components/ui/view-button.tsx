import { memo } from "react"

// Memoize the ViewButton since it doesn't change
export const ViewButton = memo(function ViewButton() {
  return (
    <button className="px-3 py-1 text-xs bg-[#8c1c3a] text-white rounded-md shadow-sm hover:bg-[#732032] transition-colors">
      View
    </button>
  )
})
