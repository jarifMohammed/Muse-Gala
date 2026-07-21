import { create } from "zustand";

interface IFilterBooking {
  search: string;
  setSearch: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

const initialStates = {
  search: "",
  startDate: "",
  endDate: "",
};

export const useFilterBooking = create<IFilterBooking>((set) => ({
  ...initialStates,
  setSearch: (value: string) => set({ search: value }),
  setStartDate: (value: string) => set({ startDate: value }),
  setEndDate: (value: string) => set({ endDate: value }),
}));
