// /zustand/useLocationStore.ts
import { create } from 'zustand'

interface Lender {
  _id: string
  email: string
  location: {
    type: string
    coordinates: [number, number] // [lng, lat]
  }
  distance: number
}

interface LocationStore {
  latitude: number | null
  longitude: number | null
  lenders: Lender[]
  loading: boolean

  setLocation: (lat: number | null, lng: number | null) => void
  setLenders: (data: Lender[]) => void
  setLoading: (value: boolean) => void
}

export const useLocationStore = create<LocationStore>((set) => ({
  latitude: null,
  longitude: null,
  lenders: [],
  loading: false,

  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setLenders: (lenders) => set({ lenders }),
  setLoading: (value) => set({ loading: value }),
}))
