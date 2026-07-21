import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ApiProduct } from '@/app/(website)/find-near-you/utility/normalizeProducts'

interface Pagination {
  totalPages: number
  totalItems: number
  currentPage: number
}

interface Location {
  latitude: number
  longitude: number
  placeName: string
}

export interface MapMarkerProduct {
  id?: string
  name?: string
  image?: string
  brand?: string
  basePrice?: number
  sizes?: string[]
  shipping?: boolean
  pickup?: boolean
}

export interface MapMarker {
  latitude: number
  longitude: number
  lenderId?: string
  lenderName?: string
  masterDressCount?: number
  products?: MapMarkerProduct[]
}

interface FindNearYouState {
  selectedLocation: Location | null
  radius: number
  size: string
  category: string
  minPrice: string
  maxPrice: string
  page: number
  allProducts: ApiProduct[]
  mapMarkers: MapMarker[]
  searchTerm: string
  pagination: Pagination | null
  isLoading: boolean

  // Actions
  setState: (partial: Partial<FindNearYouState>) => void
  resetPage: () => void
  nextPage: () => void
  setAllProducts: (
    products: ApiProduct[] | ((prev: ApiProduct[]) => ApiProduct[])
  ) => void
  appendProducts: (products: ApiProduct[]) => void
  setPagination: (pagination: Pagination | null) => void
  resetAll: () => void
}

export const useFindNearYouStore = create<FindNearYouState>()(
  persist(
    (set) => ({
      selectedLocation: null,
      radius: 50,
      size: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
      allProducts: [],
      mapMarkers: [],
      searchTerm: '',
      pagination: null,
      isLoading: false,

      // Actions
      setState: (partial) => set((state) => ({ ...state, ...partial })),
      resetPage: () => set({ page: 1 }),
      nextPage: () => set((state) => ({ page: state.page + 1 })),
      setAllProducts: (products) =>
        set((state) => ({
          allProducts:
            typeof products === 'function'
              ? products(state.allProducts)
              : products,
        })),
      appendProducts: (products) =>
        set((state) => ({ allProducts: [...state.allProducts, ...products] })),
      setPagination: (pagination) => set({ pagination }),
      resetAll: () =>
        set({
          selectedLocation: null,
          radius: 50,
          size: '',
          category: '',
          minPrice: '',
          maxPrice: '',
          page: 1,
          allProducts: [],
          mapMarkers: [],
          searchTerm: '',
          pagination: null,
          isLoading: false,
        }),
    }),
    {
      name: 'find-near-you-storage', // sessionStorage key
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        radius: state.radius,
        size: state.size,
        category: state.category,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
      }),
    }
  )
)
