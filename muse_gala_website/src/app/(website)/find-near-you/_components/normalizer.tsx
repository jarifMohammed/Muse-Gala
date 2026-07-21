// utils/normalizeLenders.ts
import {
  ApiProduct,
  ProductCardData,
} from '@/app/(website)/find-near-you/utility/normalizeProducts'

export interface LenderMarker {
  lenderId: string
  lenderName: string
  lat: number
  lng: number
  products: ProductCardData[]
}

export function normalizeLenders(products?: ApiProduct[]): LenderMarker[] {
  if (!products || products.length === 0) return []

  const markersMap = new Map<string, LenderMarker>()

  products.forEach((p, idx) => {
    const lenderId = p?.lenderId?._id
    const lenderName = p?.lenderId?.fullName || 'Unknown Lender'
    const lat = p?.lenderId?.latitude
    const lng = p?.lenderId?.longitude

    if (!lenderId || lat == null || lng == null) return

    const pickupOption = p.pickupOption?.toLowerCase() || ''

    const pickup =
      pickupOption === 'pickup' ||
      pickupOption === 'both' ||
      pickupOption.includes('pickup')

    const shipping =
      pickupOption === 'shipping' ||
      pickupOption === 'both' ||
      pickupOption.includes('shipping') ||
      pickupOption.includes('australia')

    const product: ProductCardData = {
      id: p._id || p.id || String(idx),
      name: p.dressName || p.name || 'No Name',
      price: p.rentalPrice?.fourDays
        ? `$${p.rentalPrice.fourDays}`
        : p.price || '$XX',
      size: p.size || 'N/A',
      image: p.media?.[0] || p.image || '/images/dress.png',
      description: p.description || '',
      pickup,
      shipping,
      days: p.days ?? 4,
      latitude: lat,
      longitude: lng,
    }

    if (!markersMap.has(lenderId)) {
      markersMap.set(lenderId, {
        lenderId,
        lenderName,
        lat,
        lng,
        products: [product],
      })
    } else {
      markersMap.get(lenderId)!.products.push(product)
    }
  })

  return Array.from(markersMap.values())
}
