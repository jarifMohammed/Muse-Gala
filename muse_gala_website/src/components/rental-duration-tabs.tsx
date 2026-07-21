"use client"

import { useState } from "react"
import { calculate8DayRentalPrice } from "@/utils/rentalPrice"
type RentalDuration = "4" | "8";

interface RentalDurationTabsProps {
  price: number
  baseRentalFee: number
  onDurationChange: (duration: RentalDuration) => void
}

export function RentalDurationTabs({ baseRentalFee, onDurationChange }: RentalDurationTabsProps) {
  const [activeDuration, setActiveDuration] = useState<RentalDuration>("4")

  const handleDurationChange = (duration: RentalDuration) => {
    setActiveDuration(duration)
    onDurationChange(duration)
  }

  return (
    <div className="flex border-b border-black">
  <button
    className={`w-1/2 py-4 text-center tracking-[0.2em] text-base leading-[20px] ${
      activeDuration === "4" ? "border-b-2 border-black" : ""
    }`}
    onClick={() => handleDurationChange("4")}
  >
    4 DAY RENT
  </button>
  <button
    className={`w-1/2 py-4 text-center tracking-[0.2em] leading-[20px] ${
      activeDuration === "8" ? "border-b-2 border-black" : ""
    }`}
    onClick={() => handleDurationChange("8")}
  >
    8 DAY RENT (${calculate8DayRentalPrice(baseRentalFee)})
  </button>
</div>
  )
}
