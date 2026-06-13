import type { StateCreator } from "zustand";
import type { FilterState } from "@/src/types/common";
import { ALL_CLANS_OPTION, YEAR_RANGE_MIN, YEAR_RANGE_MAX } from "@/src/constants";

const initialFilters: FilterState = {
  searchQuery: "",
  selectedClan: ALL_CLANS_OPTION,
  yearRange: [YEAR_RANGE_MIN, YEAR_RANGE_MAX],
  verifiedOnly: false,
  pendingOralHistoryOnly: false,
};

export interface FilterSlice {
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
}

export const createFilterSlice: StateCreator<FilterSlice, [], [], FilterSlice> = (set) => ({
  filters: initialFilters,

  setFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () => set({ filters: initialFilters }),
});
