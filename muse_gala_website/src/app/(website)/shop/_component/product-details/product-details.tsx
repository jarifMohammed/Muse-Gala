'use client'

import { useParams } from 'next/navigation'
import React from 'react'
import ShopCard from './shop-card'
import ShopDetails from './shop-details'
import { useQuery } from '@tanstack/react-query'

import HowItWork from '@/components/HowItWork'
import GiveAndTake from '@/components/section/GiveAndTake'
import StyledByYou from '@/components/section/style-by-you'

// ------------------- TYPES -------------------
interface ShippingDetails {
  isLocalPickup: boolean
  isShippingAvailable: boolean
}

export interface Product {
  _id: string
  dressName: string
  listingIds: string[]
  lenderIds: string[]
  sizes: string[]
  colors: string[]
  occasions: string[]
  media: string[]
  thumbnail: string
  shippingDetails: ShippingDetails
  insuranceFee: number
  basePrice: number
  rrpPrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  slug: string
  masterDressId: string
  __v: number
  brand: string
}

export interface SingleProductResponse {
  success: boolean
  message: string
  data: Product | Product[]
}

// ------------------- COMPONENT -------------------
const ProductDetails = () => {
  const params = useParams()
  const idOrName = decodeURIComponent((params.slug || params.id) as string)

  // ✅ smart API selector
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dress/${idOrName}`

  const { data, isLoading } = useQuery<SingleProductResponse>({
    queryKey: ['single-product', idOrName],
    queryFn: async () => {
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error('Failed to fetch product')
      return res.json()
    },
    enabled: !!idOrName,
  })

  // Handle both response shapes
  const singleProduct = Array.isArray(data?.data) ? data?.data[0] : data?.data
  const productdata = singleProduct

  const thumbnailImage = singleProduct?.thumbnail ?? ''
  const allImages = singleProduct?.media ?? []

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-start">
        <div className="lg:w-[35%]">
          <ShopCard
            thumbnailImage={thumbnailImage}
            allImages={allImages}
            isLoading={isLoading}
            productdata={productdata}
          />
        </div>

        <div className="lg:w-[65%] sticky top-28 h-fit">
          <ShopDetails
            singleProduct={{ data: singleProduct }}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="mt-4 md:mt-8 space-y-4">
        <StyledByYou />
        <HowItWork />
        <GiveAndTake />
      </div>
    </div>
  )
}

export default ProductDetails
