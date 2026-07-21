import type { Product as ImportedProduct } from '@/types/product'

// Ensure Product type includes 'name' and 'description'
export interface Product extends ImportedProduct {
  id: string
  name: string
  description: string
  price: number
  size: string[]
  // Add other required fields if necessary
}

// Define ProductSize type if not imported from elsewhere
export type ProductSize = string // Replace 'string' with the correct type if needed

// Define RentalDuration type if not imported from elsewhere
export type RentalDuration = string // Replace 'string' with the correct type if needed

export interface FilterOptions {
  searchQuery?: string
  availableNearMe?: boolean
  rentalDurations?: RentalDuration[]
  pickupLocation?: string
  pickupDistance?: number // Added for distance slider
  eventDate?: string
  priceRange?: number
  colors?: string[]
  sizes?: ProductSize[]
  designers?: string[]
  categories?: string[]
  locations?: string[]
}

export function filterProducts(
  products: Product[],
  filters: FilterOptions
): Product[] {
  return products.filter((product) => {
    // Search query filter
    if (
      filters.searchQuery &&
      !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !product.description
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase())
    ) {
      return false
    }

    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      if (!filters.sizes.some((size) => product?.size?.includes(size))) {
        return false
      }
    }

    // Price range filter
    if (filters.priceRange && product.price > filters.priceRange) {
      return false
    }

    // Pickup distance filter - would need location data on products
    // if (filters.pickupDistance && product.location) {
    //   const distance = calculateDistance(userLocation, product.location);
    //   if (distance > filters.pickupDistance) {
    //     return false;
    //   }
    // }

    // Rental duration filter - would need rental duration data on products
    // if (filters.rentalDurations && filters.rentalDurations.length > 0) {
    //   // Implementation depends on how rental durations are stored in product data
    // }

    // Designer filter - would need designer data on products
    if (filters.designers && filters.designers.length > 0) {
      // For demo purposes, we'll just filter based on product ID
      // In a real app, you'd have a designer field on the product
      if (
        !filters.designers.some((designer) =>
          product.id.includes(designer.split('-')[1])
        )
      ) {
        return false
      }
    }

    // Category filter - would need category data on products
    // if (filters.categories && filters.categories.length > 0) {
    //   // Implementation depends on how categories are stored in product data
    // }

    // Location filter - would need location data on products
    // if (filters.locations && filters.locations.length > 0) {
    //   // Implementation depends on how locations are stored in product data
    // }

    // Available near me filter - would need location data on products
    // if (filters.availableNearMe) {
    //   // Implementation depends on user location and product location data
    // }

    // Event date filter - would need availability data on products
    // if (filters.eventDate) {
    //   // Implementation depends on how availability is stored in product data
    // }

    return true
  })
}

// Helper function to calculate distance between two coordinates
// This would be used in a real implementation with actual location data
// export function calculateDistance(location1, location2) {
//   // Haversine formula or similar to calculate distance between coordinates
//   return distance; // in kilometers
// }
