export type TrendingProduct = {
  _id: string
  brand?: string
  dressName: string
  listingIds: string[]
  lenderIds: string[]
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
  isActive: boolean
  createdAt: string
  updatedAt: string
  slug: string
  masterDressId: string
}
