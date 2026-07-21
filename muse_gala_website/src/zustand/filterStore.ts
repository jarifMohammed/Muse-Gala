import { create } from 'zustand'

interface IFilter {
  search: string
  setSearch: (value: string) => void

  fourDayRental: boolean
  setFourDayRental: (value: boolean) => void
  eightDayRental: boolean
  setEightDayRental: (value: boolean) => void

  shipping: boolean
  localPickup: boolean
  selectShipping: () => void
  selectLocalPickup: () => void

  minPrice: string
  setMinPrice: (value: string) => void

  maxPrice: string
  setMaxPrice: (value: string) => void

  size: string
  setSize: (value: string) => void
 
  brand: string
  setBrand: (value: string) => void

  page: number
  resetPage: () => void
  nextPage: () => void
  setPage: (value: number) => void
  resetFilters: () => void
}

const initialState = {
  search: '',
  fourDayRental: false,
  eightDayRental: false,

  shipping: false, // ✅ default changed to show all
  localPickup: false, // ✅ default changed to show all

  minPrice: '',
  maxPrice: '',
  size: '',
  brand: '',
  page: 1,
}

export const useFilterStore = create<IFilter>()((set) => ({
  ...initialState,

  setSearch: (value) => set({ search: value, page: 1 }),
  setFourDayRental: (value) => set({ fourDayRental: value, page: 1 }),
  setEightDayRental: (value) => set({ eightDayRental: value, page: 1 }),

  // ✅ Independent Toggle behavior for checkboxes
  selectShipping: () =>
    set((state) => ({
      shipping: !state.shipping,
      page: 1,
    })),

  selectLocalPickup: () =>
    set((state) => ({
      localPickup: !state.localPickup,
      page: 1,
    })),

  setMinPrice: (value) => set({ minPrice: value, page: 1 }),
  setMaxPrice: (value) => set({ maxPrice: value, page: 1 }),
  setSize: (value) => set({ size: value, page: 1 }),
  setBrand: (value) => set({ brand: value, page: 1 }),

  resetPage: () => set({ page: 1 }),
  nextPage: () => set((state) => ({ page: state.page + 1 })),
  setPage: (value) => set({ page: value }),

  resetFilters: () => set({ ...initialState }),
}))
