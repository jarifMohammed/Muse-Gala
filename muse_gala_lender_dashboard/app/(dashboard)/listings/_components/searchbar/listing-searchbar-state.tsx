import { create } from "zustand";

interface FilterStore {
  searchTerm: string;
  statusFilter: string;
  sizeFilter: string;
  conditionFilter: string;
  pickupFilter: string;
  page: number; // new state
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setSizeFilter: (value: string) => void;
  setConditionFilter: (value: string) => void;
  setPickupOption: (value: string) => void;
  setPage: (value: number) => void; // new setter
  resetFilters: () => void;
}

export const useListingFilterStrate = create<FilterStore>((set) => ({
  searchTerm: "",
  statusFilter: "All",
  sizeFilter: "All",
  conditionFilter: "All",
  pickupFilter: "",
  page: 1, // default page
  setSearchTerm: (value) => set({ searchTerm: value }),
  setStatusFilter: (value) => set({ statusFilter: value }),
  setSizeFilter: (value) => set({ sizeFilter: value }),
  setConditionFilter: (value) => set({ conditionFilter: value }),
  setPickupOption: (value) => set({ pickupFilter: value }),
  setPage: (value) => set({ page: value }),
  resetFilters: () =>
    set({
      searchTerm: "",
      statusFilter: "All",
      sizeFilter: "All",
      conditionFilter: "All",
      pickupFilter: "",
      page: 1, // reset page too
    }),
}));
