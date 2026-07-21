import { create } from "zustand";

type Status = "All" | "approved" | "pending" | "rejected";

interface LenderListingState {
  approvalStatus: Status;
  searchQuery: string;
  page: number;
  perPage: number;
  setApprovalStatus: (status: Status) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  resetFilters: () => void;
}

export const useLenderListingState = create<LenderListingState>((set) => ({
  approvalStatus: "All",
  searchQuery: "",
  page: 1,
  perPage: 10,
  setApprovalStatus: (status) => set({ approvalStatus: status, page: 1 }), // reset page on filter change
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }), // reset page on search change
  setPage: (page) => set({ page }),
  setPerPage: (perPage) => set({ perPage, page: 1 }), // reset to first page when perPage changes
  resetFilters: () =>
    set({
      approvalStatus: "All",
      searchQuery: "",
      page: 1,
      perPage: 10,
    }),
}));
