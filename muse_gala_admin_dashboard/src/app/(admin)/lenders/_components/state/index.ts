// stores/lenderSearchStore.ts
import { create } from "zustand";

type DateRange = {
  from: Date | undefined | string;
  to: Date | undefined | string;
};

type LenderSearchState = {
  value: string;
  status: string;
  page: number;
  setPage: (page: number) => void;
  dateRange: DateRange;
  setValue: (value: string) => void;
  setStatus: (status: string) => void;
  setDateRange: (range: DateRange) => void;
};

export const useLenderSearchStore = create<LenderSearchState>((set) => ({
  value: "",
  status: "all",
  page: 1,
  setPage: (page) => set({ page }),
  dateRange: {
    from: undefined,
    to: undefined,
  },
  setValue: (value) => set({ value }),
  setStatus: (status) => set({ status }),
  setDateRange: (dateRange) => set({ dateRange }),
}));
