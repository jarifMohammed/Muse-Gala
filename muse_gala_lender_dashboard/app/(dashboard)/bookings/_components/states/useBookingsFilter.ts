import { create } from "zustand";

interface IBookingFilter {
  search: string;
  setSearch: (value: string) => void;
  deliveryType: string;
  setDeliveryType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

const initialStates = {
  search: "",
  deliveryType: "",
  status: "",
  startDate: "",
  endDate: "",
};

export const useBookingsFilter = create<IBookingFilter>((set) => ({
  ...initialStates,
  setSearch: (value: string) => set({ search: value }),
  setDeliveryType: (value: string) => set({ deliveryType: value }),
  setStatus: (value: string) => set({ status: value }),
  setStartDate: (value: string) => set({ startDate: value }),
  setEndDate: (value: string) => set({ endDate: value }),
}));

