import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import vehicles from '../data/vehicles.json';

export const DEFAULT_FILTERS = { search: '', statuses: [] };

export function createInitialState() {
  const byId = {};
  const ids = [];
  for (const v of vehicles) {
    byId[v.id] = v;
    ids.push(v.id);
  }
  return {
    byId,
    ids,
    filters: { ...DEFAULT_FILTERS, statuses: [] },
    selectedIds: [],
  };
}

export const useFleetStore = create(
  persist(
    (set) => ({
      ...createInitialState(),

      setFilters: (partial) =>
        set((s) => ({ filters: { ...s.filters, ...partial } })),

      resetFilters: () =>
        set({ filters: { ...DEFAULT_FILTERS, statuses: [] } }),

      toggleSelected: (id) =>
        set((s) => ({
          selectedIds: s.selectedIds.includes(id)
            ? s.selectedIds.filter((x) => x !== id)
            : [...s.selectedIds, id],
        })),

      clearSelection: () => set({ selectedIds: [] }),

      // Only the changed vehicle gets a new object; the other 399 keep the same reference
      updateVehicle: (id, changes) =>
        set((s) =>
          s.byId[id]
            ? { byId: { ...s.byId, [id]: { ...s.byId[id], ...changes } } }
            : s
        ),
    }),
    {
      name: 'fleet-ops-state',
      partialize: (s) => ({ filters: s.filters, selectedIds: s.selectedIds }),
    }
  )
);