import { create } from 'zustand';

const useFilterStore = create((set, get) => ({
  // Filter state
  selectedCategories: [],
  selectedConditions: [],
  selectedLocations: [],
  priceRange: [0, 500000],
  sortBy: 'newest',

  // Actions
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedConditions: (conditions) => set({ selectedConditions: conditions }),
  setSelectedLocations: (locations) => set({ selectedLocations: locations }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setSortBy: (sortBy) => set({ sortBy }),

  // Apply filters at once
  applyFilters: (filters) => set({
    selectedCategories: filters.categories || [],
    selectedConditions: filters.conditions || [],
    selectedLocations: filters.locations || [],
    priceRange: filters.priceRange || [0, 500000],
    sortBy: filters.sortBy || 'newest'
  }),

  // Clear filters
  clearFilters: () => set({
    selectedCategories: [],
    selectedConditions: [],
    selectedLocations: [],
    priceRange: [0, 500000],
    sortBy: 'newest'
  }),

  // Check if any filter is active
  hasActiveFilters: () => {
    const state = get();
    return (
      state.selectedCategories.length > 0 ||
      state.selectedConditions.length > 0 ||
      state.selectedLocations.length > 0 ||
      state.priceRange[0] > 0 ||
      state.priceRange[1] < 500000
    );
  }
}));

export default useFilterStore;
