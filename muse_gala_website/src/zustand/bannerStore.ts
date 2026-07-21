import { create } from 'zustand'

interface BannerState {
  bannerUrl: string | null
  setBannerUrl: (url: string) => void
}

export const useBannerStore = create<BannerState>((set) => ({
  bannerUrl: null,
  setBannerUrl: (url) => set({ bannerUrl: url }),
}))
