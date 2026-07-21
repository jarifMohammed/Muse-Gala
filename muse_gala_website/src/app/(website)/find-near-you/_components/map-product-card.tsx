import Image from 'next/image'
import { Truck, MapPin } from 'lucide-react'
import Link from 'next/link'

interface ProductCardProps {
  id?: string
  name?: string | ''
  price?: string
  days?: number
  size?: string
  image?: string
  description?: string
  shipping?: boolean
  pickup?: boolean
  brand?: string
  category?: string
}

export default function MapProductCard({
  name,
  brand,
  size,
  image,
  description,
  shipping,
  pickup,
}: ProductCardProps) {
  return (
    <div>
      <Link href={`/shop/${encodeURIComponent(name ?? '')}`} className="group block">
        <div className="flex items-center gap-[20px] md:gap-[25px] lg:gap-[30px] md:mb-[25px] lg:mb-[30px]">
          <div>
            <Image
              src={image || '/placeholder.svg'}
              alt={name || 'Product Image'}
              width={196}
              height={257}
              className="w-full aspect-[2/3] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="w-full relative">
            <div className="w-full flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-1">
                {brand && (
                  <p className="text-[12px] opacity-70 uppercase tracking-widest font-avenir mb-1">
                    {brand}
                  </p>
                )}
                <h3 className="brand-subheader text-black leading-[25px] md:leading-[30px] lg:leading-[36px] group-hover:text-gray-600 transition-colors">
                  {name}
                </h3>
                <p className="brand-body text-black leading-[20px] md:leading-[22px] lg:leading-[24px] mt-2">
                  Size: {size}
                </p>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-[10px] md:gap-[13px] lg:gap-[15px] py-[12px] md:py-[14px] lg:py-[16px]">
                  {shipping && (
                    <div className="flex items-center gap-[10px] md:gap-[13px] lg:gap-[15px]">
                      <Truck width={25} height={20} />
                      <span className="brand-body text-black leading-[20px]">
                        SHIPPING
                      </span>
                    </div>
                  )}

                  {pickup && (
                    <div className="flex items-center gap-[10px] md:gap-[13px] lg:gap-[15px]">
                      <MapPin className="w-[17px] h-[20px]" />
                      <span className="brand-body text-black leading-[20px]">
                        PICKUP
                      </span>
                    </div>
                  )}
                </div>
                <p className="brand-body text-black leading-[120%]">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="block md:hidden pb-[25px]">
        <Link href={`/shop/${encodeURIComponent(name ?? '')}`}>
          <div className="w-full flex items-center justify-center">
            <button className="w-full my-4 rounded-md bg-black brand-button text-white py-2">
              BOOK NOW
            </button>
          </div>
        </Link>
      </div>
    </div>
  )
}
