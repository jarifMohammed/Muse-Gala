export interface Product {
  _id: string
  brand?: string
  dressName: string
  sizes: string[]
  colors: string[]
  occasions: string[]
  media: string[]
  thumbnail: string
  shippingDetails: {
    isLocalPickup: boolean
    isShippingAvailable: boolean
  }
  insuranceFee: number
  basePrice: number
  rrpPrice: number
  slug: string
  masterDressId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// src/app/(website)/types/product.ts
export interface ProductCardData {
  id: string
  name?: string
  image?: string
  price?: number
  size?: string
  shipping?: boolean
  pickup?: boolean
  latitude?: number
  longitude?: number
  rentalPrice?: { fourDays?: string | number }
}

export type DeliveryOption = 'shipping' | 'local-pickup'
