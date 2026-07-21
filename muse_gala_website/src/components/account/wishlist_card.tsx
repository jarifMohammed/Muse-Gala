import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export interface WishlistItem {
  _id: string
  dressName: string
  thumbnail: string
  basePrice: number
  rrpPrice: number
}

interface Props {
  item: WishlistItem
  onRemove?: (id: string) => void
}

const WishlistCard = ({ item, onRemove }: Props) => {
  return (
    <div className="mb-24 overflow-hidden relative group">
      {/* X Button (NOT inside Link) */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove(item._id)
          }}
          className="absolute top-2 right-2 bg-white text-black p-1 rounded-full z-20 opacity-100 group-hover:opacity-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* CLICKABLE AREA */}
      <Link href={`/shop/${item._id}`}>
        <div className="flex flex-col relative">
          {/* Product Image */}
          <div className="relative aspect-[3/4] mb-5 w-full">
            <Image
              src={item.thumbnail}
              alt={item.dressName}
              fill
              className="object-cover object-top rounded-md"
            />
          </div>

          {/* Product Title */}
          <h3 className="text-lg md:text-xl tracking-widest font-light text-center text-black mb-[10px]">
            {item.dressName}
          </h3>

          {/* Price */}
          <p className="text-[12px] md:text-sm font-light text-black text-center tracking-widest">
            RENT ${item.basePrice} | RRP ${item.rrpPrice}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default WishlistCard
