import { describe, it, expect, beforeEach } from 'vitest';
import {
  useFleetStore,
  DEFAULT_FILTERS,
  createInitialState,
} from './useFleetStore.js';

beforeEach(() => {
  localStorage.clear();
  useFleetStore.setState(createInitialState());
});

describe('fleet store', () => {
  it('starts with 400 vehicles, default filters and empty selection', () => {
    const s = useFleetStore.getState();
    expect(s.ids).toHaveLength(400);
    expect(Object.keys(s.byId)).toHaveLength(400);
    expect(s.filters).toEqual(DEFAULT_FILTERS);
    expect(s.selectedIds).toEqual([]);
  });

  it('selects and unselects a vehicle', () => {
    useFleetStore.getState().toggleSelected('V-001');
    expect(useFleetStore.getState().selectedIds).toEqual(['V-001']);
    useFleetStore.getState().toggleSelected('V-001');
    expect(useFleetStore.getState().selectedIds).toEqual([]);
  });

  it('updates and resets filters', () => {
    useFleetStore.getState().setFilters({ search: 'van', statuses: ['idle'] });
    expect(useFleetStore.getState().filters).toEqual({
      search: 'van',
      statuses: ['idle'],
    });
    useFleetStore.getState().resetFilters();
    expect(useFleetStore.getState().filters).toEqual(DEFAULT_FILTERS);
  });

  it('updateVehicle changes only one vehicle object', () => {
    const before = useFleetStore.getState().byId;
    useFleetStore.getState().updateVehicle('V-001', { status: 'offline' });
    const after = useFleetStore.getState().byId;

    expect(after['V-001']).not.toBe(before['V-001']);
    expect(after['V-001'].status).toBe('offline');
    expect(after['V-002']).toBe(before['V-002']);
  });
});