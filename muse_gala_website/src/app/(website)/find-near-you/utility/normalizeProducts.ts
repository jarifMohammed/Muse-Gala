// utils/normalizeProducts.ts

export interface ProductCardData {
  id: string | number
  name: string
  price: string
  days: number
  size: string
  image: string
  description: string
  shipping: boolean
  pickup: boolean
  latitude: number
  longitude: number

  // Extra fields
  lenderId?: string
  lenderName?: string
  lenders?: Record<string, unknown>[]
  approvalStatus?: string
  brand?: string
  category?: string
  colour?: string
  condition?: string
  material?: string
  insurance?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiProduct {
  _id?: string
  id?: string
  dressId?: string
  dressName?: string
  name?: string
  basePrice?: number
  price?: string
  rentalPrice?: { fourDays?: number; eightDays?: number }
  sizes?: string[]
  size?: string
  media?: string[]
  image?: string
  description?: string
  pickupOption?: string
  shippingDetails?: {
    isLocalPickup?: boolean
    isShippingAvailable?: boolean
  }
  latitude?: number
  longitude?: number
  days?: number
  lenders?: {
    _id?: string
    firstName?: string
    latitude?: number
    longitude?: number
  }[]
  lenderId?: {
    _id?: string
    fullName?: string
    email?: string
    latitude?: number
    longitude?: number
  }

  // 🆕 Extra props
  approvalStatus?: string
  brand?: string
  category?: string
  colour?: string
  condition?: string
  material?: string
  insurance?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
}

// 🟢 Default fallback → Thai Town, Sydney
const DEFAULT_LAT = -33.8786
const DEFAULT_LNG = 151.2069

export function normalizeProducts(
  products?: ApiProduct[] | null
): ProductCardData[] {
  if (!products || products.length === 0) return []

  return products.map((product, idx) => {
    // Navigate backwards compatibility with pickupOption or use new shippingDetails
    const pickupOption = product.pickupOption?.toLowerCase() || ''
    const pickup = product.shippingDetails?.isLocalPickup ?? (
      pickupOption === 'pickup' ||
      pickupOption === 'both' ||
      pickupOption.includes('pickup')
    )

    const shipping = product.shippingDetails?.isShippingAvailable ?? (
      pickupOption === 'shipping' ||
      pickupOption === 'both' ||
      pickupOption.includes('shipping') ||
      pickupOption.includes('australia')
    )

    return {
      id: product._id || product.id || product.dressId || idx,
      name: product.dressName || product.name || 'No Name',
      price: product.basePrice 
        ? `$${product.basePrice}` 
        : (product.rentalPrice?.fourDays ? `$${product.rentalPrice.fourDays}` : product.price || '$XX'),
      size: product.sizes && product.sizes.length > 0 
        ? product.sizes.join(', ')
        : (product.size || 'N/A'),
      image: product.media?.[0] || product.image || '/images/dress.png',
      description: product.description || '',
      pickup,
      shipping,
      days: product.days ?? 4,
      latitude: product.lenders?.[0]?.latitude ?? product.latitude ?? product.lenderId?.latitude ?? DEFAULT_LAT,
      longitude: product.lenders?.[0]?.longitude ?? product.longitude ?? product.lenderId?.longitude ?? DEFAULT_LNG,

      // 🆕 Extra props mapping
      lenders: product.lenders,
      lenderId: product.lenderId?._id,
      lenderName: product.lenderId?.fullName,
      approvalStatus: product.approvalStatus,
      brand: product.brand,
      category: product.category,
      colour: product.colour,
      condition: product.condition,
      material: product.material,
      insurance: product.insurance,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  })
}
