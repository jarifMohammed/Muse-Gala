'use client'

import { useShoppingStore } from '@/zustand/shopingStore'
import ShoppingRent from './shopping-rent'
import DeliveryOption from './delivery-option'
import PriceBreakDown from './price-breakdown'
import { calculate8DayRentalPrice } from '@/utils/rentalPrice'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import ShopDetailsSkeleton from '@/skeleton/ShopDetailsSkeleton'

// ------------------
// Types
// ------------------

interface ShippingDetails {
  isLocalPickup?: boolean
  isShippingAvailable?: boolean
}

interface ProductData {
  _id: string
  dressName: string
  basePrice: number
  insuranceFee?: number
  rrpPrice?: number
  lenderIds?: string[]
  listingIds?: string[]
  sizes?: string[]
  colors?: string[]
  slug?: string
  masterDressId?: string
  thumbnail?: string
  media?: string[]
  occasions?: string[]
  createdAt?: string
  updatedAt?: string
  shippingDetails?: ShippingDetails
  bookedDates?: string[][]
  brand?: string
}

interface ShopDetailsProps {
  singleProduct: {
    data?: ProductData
  }
  isLoading?: boolean
}

// ------------------
// Component
// ------------------

const ShopDetails: React.FC<ShopDetailsProps> = ({
  singleProduct,
  isLoading,
}) => {
  const { rent, setRent, selectedSize, setSelectedSize, selectedColor, setSelectedColor } = useShoppingStore()
  const pathName = usePathname()
  const data = singleProduct?.data
  const isCheckoutPage =
    pathName?.startsWith('/shop/checkout') && !pathName.includes('/confirmation')

  // console.log('shopping details page', data)

  if (isLoading) return <ShopDetailsSkeleton />

  if (!data) return <p>No dress found.</p>

  // For display only: apply tiered multiplier for 8-day rent
  const displayPrice = rent === '8' ? calculate8DayRentalPrice(data.basePrice) : data.basePrice

  return (
    <div className="lg:min-h-[660px] font-avenir">
      {isCheckoutPage ? (
        <h1 className="font-light opacity-75 text-[18px] tracking-[0.5rem] uppercase mb-8">
          Order Summary
        </h1>
      ) : (
        <div>
          {/* Brand */}
          {data.brand && (
            <p className="font-light tracking-[0.3rem] uppercase opacity-80 ">
              {data.brand}
            </p>
          )}

          {/* Dress Name */}
          <h1 className="font-light tracking-[0.25rem] uppercase leading-snug mt-4">
            {data.dressName}
          </h1>

          {/* Price */}
          <p className="tracking-wider mt-6 opacity-75 uppercase">
            ${displayPrice} RENT
          </p>

          {/* RRP */}
          {!!data.rrpPrice && (
            <p className="tracking-wider mt-1 opacity-50 uppercase text-sm">
              RRP ${data.rrpPrice}
            </p>
          )}

          {/* Size Selector */}
          {data.sizes && data.sizes.length > 0 && (
            <div className="mt-8">
              <p className="tracking-[0.25rem] opacity-80 font-semibold uppercase text-[10px] mb-3 font-avenir">
                Select Size
              </p>
              <div className="flex flex-wrap gap-2">
                {data.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`relative min-w-[48px] px-4 py-2 text-[11px] uppercase tracking-[0.2rem] border transition-all duration-200 font-avenir ${selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-black/60 border-black/20 hover:border-black/60 hover:text-black'
                      }`}
                  >
                    {size}
                    {selectedSize === size && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {data.colors && data.colors.length > 0 && (
            <div className="mt-6">
              <p className="tracking-[0.25rem] opacity-80 font-semibold uppercase text-[10px] mb-3 font-avenir">
                Select Color
              </p>
              <div className="flex flex-wrap gap-2">
                {data.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                    className={`relative min-w-[48px] px-4 py-2 text-[11px] uppercase tracking-[0.2rem] border transition-all duration-200 font-avenir ${selectedColor === color
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-black/60 border-black/20 hover:border-black/60 hover:text-black'
                      }`}
                  >
                    {color}
                    {selectedColor === color && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isCheckoutPage && (
          <div className="flex items-start gap-2 border-b border-black">
            <div>
              <Image
                src={data.thumbnail ?? '/placeholder.png'}
                alt={data.dressName}
                width={1000}
                height={1000}
                className="w-[120px] h-[120px] object-cover object-top"
              />
            </div>

            <div className="pt-6">
              <h1 className="font-light opacity-75 tracking-[0.1rem] uppercase">
                {data.brand && <span className="block mb-1 sub-header text-sm lg:text-lg">{data.brand}</span>}
                <span className="brand-body text-sm lg:text-lg">{data.dressName}</span>
              </h1>
              <p className="tracking-wider mt-2 opacity-75 uppercase text-sm lg:text-lg">
                ${displayPrice} RENT
              </p>
              {!!data.rrpPrice && (
                <p className="tracking-wider mt-0.5 opacity-50 uppercase text-xs">
                  RRP ${data.rrpPrice}
                </p>
              )}
              {selectedSize && (
                <p className="tracking-wider mt-1 opacity-60 uppercase text-sm">
                  Size: {selectedSize}
                </p>
              )}
              {selectedColor && (
                <p className="tracking-wider mt-1 opacity-60 uppercase text-sm">
                  Color: {selectedColor}
                </p>
              )}


            </div>
          </div>
        )}

      {/* Rent Option */}
      {isCheckoutPage ? (
        <div className="mt-12 opacity-75">
          <h1 className="tracking-widest border-b border-black pb-1 uppercase">
            Rental Duration
          </h1>
          <p className="pt-4 tracking-widest uppercase text-sm">
            {rent === '8' ? '8 day rent' : '4 day rent'}
          </p>
        </div>
      ) : (
        <div className="mt-12 opacity-75 flex items-center gap-5">
          <button
            onClick={() => setRent('4')}
            className={`w-1/2 pb-2 uppercase ${rent === '4'
              ? 'border-b-2 border-black'
              : 'border-b-2 border-transparent'
              }`}
          >
            4 day rent
          </button>

          <button
            onClick={() => setRent('8')}
            className={`w-1/2 pb-2 uppercase ${rent === '8'
              ? 'border-b-2 border-black'
              : 'border-b-2 border-transparent'
              }`}
          >
            8 day rent
          </button>
        </div>
      )}

      {/* Other Components */}
      <ShoppingRent />
      <DeliveryOption masterDressId={singleProduct?.data?._id || ''} />
      <PriceBreakDown singleProduct={singleProduct} />
    </div>
  )
}

export default ShopDetails
