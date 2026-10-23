import { describe, it, expect } from 'vitest';
import vehicles from './vehicles.json';
import {
  generateVehicles,
  STATUSES,
  CITY_BOUNDS,
} from '../../scripts/vehicleGenerator.js';

describe('vehicle data', () => {
  it('has exactly 400 records', () => {
    expect(vehicles).toHaveLength(400);
  });

  it('has no duplicate ids', () => {
    const ids = vehicles.map((v) => v.id);
    expect(new Set(ids).size).toBe(400);
  });

  it('every record has the exact fields and valid values', () => {
    const fields = ['id', 'lastUpdate', 'lat', 'lng', 'name', 'status'];
    for (const v of vehicles) {
      expect(Object.keys(v).sort()).toEqual(fields);
      expect(v.id).toMatch(/^V-\d{3,}$/);
      expect(v.name.length).toBeGreaterThan(0);
      expect(STATUSES).toContain(v.status);
      expect(v.lat).toBeGreaterThanOrEqual(CITY_BOUNDS.minLat);
      expect(v.lat).toBeLessThanOrEqual(CITY_BOUNDS.maxLat);
      expect(v.lng).toBeGreaterThanOrEqual(CITY_BOUNDS.minLng);
      expect(v.lng).toBeLessThanOrEqual(CITY_BOUNDS.maxLng);
      expect(new Date(v.lastUpdate).toISOString()).toBe(v.lastUpdate);
    }
  });

  it('is deterministic for the same seed', () => {
    expect(generateVehicles(400, 42)).toEqual(generateVehicles(400, 42));
  });

  it('can generate a different count', () => {
    expect(generateVehicles(10)).toHaveLength(10);
  });

  it('committed JSON matches the generator output', () => {
    expect(vehicles).toEqual(generateVehicles(400, 42));
  });
});