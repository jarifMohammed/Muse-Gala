import { MapPin, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export interface ProductCardProps {
  id: string | number
  name: string
  size: string | string[] | null
  image: string
  description?: string
  shipping?: boolean
  pickup?: boolean
  lenders?: Record<string, unknown>[]
}

export default function ProductCard({
  id,
  name,
  size,
  image,
  shipping,
  pickup,
  lenders,
}: ProductCardProps) {
  // ✅ Size handling (array or string or null)
  const displaySize = Array.isArray(size) ? size.join(', ') : size || 'N/A'

  return (
    <Link href={`/shop/${encodeURIComponent(name)}`}>
      <div key={id} className="group cursor-pointer">
        <div className="flex items-center justify-between gap-[15px] md:gap-[25px] lg:gap-[30px] transition-all duration-300">
          {/* ✅ Product Image */}
          <div className="overflow-hidden">
            <Image
              src={image || '/images/dress.png'}
              alt={name}
              width={300}
              height={300}
              className="w-full aspect-[2/3] object-cover object-top flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* ✅ Product Info */}
          <div className="w-full relative">
            <div className="w-full flex flex-col md:flex-row lg:flex-col items-center lg:items-start space-y-5">
              <div className="flex-1">
                {/* Title */}
                <h3 className="brand-subheader text-black leading-[35px] md:leading-[40px] group-hover:text-gray-600 transition-colors">
                  {name}
                </h3>

                {/* ✅ Lenders info */}
                {lenders && lenders.length > 1 && (
                  <p className="text-xs text-green-600 font-medium mb-1">
                    Available from {lenders.length} lenders nearby
                  </p>
                )}

                {/* ✅ Size */}
                <p className="brand-body text-black leading-[24px] md:leading-[32px] lg:leading-[40px]">
                  Size: {displaySize}
                </p>

                {/* ✅ Shipping & Pickup Info */}
                {(shipping || pickup) && (
                  <div className="flex flex-wrap items-center gap-[10px] py-3">
                    {shipping && (
                      <div className="flex items-center gap-[8px]">
                        <Truck className="size-5" />
                        <span className="brand-body text-black leading-[24px]">
                          SHIPPING
                        </span>
                      </div>
                    )}

                    {pickup && (
                      <div className="flex items-center gap-[8px]">
                        <MapPin className="size-5" />
                        <span className="brand-body text-black leading-[24px]">
                          PICKUP
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
