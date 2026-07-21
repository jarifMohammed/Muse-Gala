import { create } from "zustand";

interface IBookingStore {
  isBookingModalOpen: string;
  setIsBookingModalOpen: (value: string) => void;
  isDisputesModalOpen: string;
  setIsDisputesModalOpen: (value: string) => void;
}

const initialStates = {
  isBookingModalOpen: "Summary",
  isDisputesModalOpen: "Booking Snapshot"
};

export const useModalStore = create<IBookingStore>((set) => ({
  ...initialStates,
  setIsBookingModalOpen: (value: string) => set({ isBookingModalOpen: value }),
  setIsDisputesModalOpen: (value: string) => set({isDisputesModalOpen: value})
}));
