"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
// TODO: Ensure ProductSize is exported from '@/types/product'.
// If not, replace 'ProductSize' with the correct type or define it here temporarily.
// type ProductSize = string; // Uncomment this line if '@/types/product' does not export ProductSize
type ProductSize = string;
// import type { ProductSize } from "@/types/product"

const sizeGuideOptions = [
  { value: "small", label: "Runs Small" },
  { value: "true", label: "True to Size" },
  { value: "large", label: "Runs Large" },
]

interface SizeGuideProps {
  availableSizes: ProductSize[]
  defaultSize?: ProductSize
  onSizeChange: (size: ProductSize) => void
}

export function SizeGuide({ availableSizes, defaultSize, onSizeChange }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(defaultSize)
  const [sliderPosition] = useState(50) // Default to "True to Size"

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSize(size)
    onSizeChange(size)
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <button
        className="w-full flex items-center justify-between border-b border-black py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="uppercase tracking-[0.2rem] leading-[20px] text-[14px]">SIZE GUIDE</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="relative h-1 bg-gray-200">
              <div
                className="absolute w-4 h-4 bg-black rounded-full top-1/2 transform -translate-y-1/2"
                style={{ left: `${sliderPosition}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              {sizeGuideOptions.map((option) => (
                <span className="text-[18px] leading-[24px]" key={option.value}>{option.label}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`py-2 border ${
                  selectedSize === size ? "border-black bg-black text-white" : "border-gray-300"
                }`}
                onClick={() => handleSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
