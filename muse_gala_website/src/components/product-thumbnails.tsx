"use client"

import Image from "next/image"
export interface ProductImage {
  src: string
  alt: string
}

interface ProductThumbnailsProps {
  images: ProductImage[]
  onSelect: (index: number) => void
  selectedIndex: number
}

export function ProductThumbnails({ images, onSelect, selectedIndex }: ProductThumbnailsProps) {
  return (
    <div className="flex flex-col space-y-4">
      {images.map((image, index) => (
        <button
          key={index}
          className={`border hover:border-black transition-colors ${selectedIndex === index ? "border-black" : "border-gray-200"}`}
          onClick={() => onSelect(index)}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            width={100}
            height={120}
            className="aspect-[5/6] object-cover object-top"
          />
          <span className="sr-only">View Image {index + 1}</span>
        </button>
      ))}
    </div>
  )
}
