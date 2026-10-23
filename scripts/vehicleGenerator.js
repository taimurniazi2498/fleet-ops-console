export const STATUSES = ['active', 'idle', 'maintenance', 'offline'];
const STATUS_WEIGHTS = [0.55, 0.2, 0.1, 0.15];
const TYPES = ['Van', 'Truck', 'Pickup', 'Lorry'];

export const CITY_BOUNDS = {
  minLat: 53.4,
  maxLat: 53.55,
  minLng: -2.35,
  maxLng: -2.15,
};

export const BASE_TIME = Date.parse('2026-10-23T08:00:00.000Z');

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickStatus(r) {
  let sum = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    sum += STATUS_WEIGHTS[i];
    if (r < sum) return STATUSES[i];
  }
  return STATUSES[STATUSES.length - 1];
}

const round5 = (n) => Math.round(n * 1e5) / 1e5;

export function generateVehicles(count = 400, seed = 42) {
  const rand = mulberry32(seed);
  const { minLat, maxLat, minLng, maxLng } = CITY_BOUNDS;
  const vehicles = [];

  for (let i = 1; i <= count; i++) {
    const n = String(i).padStart(3, '0');
    const type = TYPES[Math.floor(rand() * TYPES.length)];
    const status = pickStatus(rand());
    const lat = round5(minLat + rand() * (maxLat - minLat));
    const lng = round5(minLng + rand() * (maxLng - minLng));
    const secondsAgo = Math.floor(rand() * 24 * 60 * 60);

    vehicles.push({
      id: `V-${n}`,
      name: `${type} NB-${n}`,
      status,
      lat,
      lng,
      lastUpdate: new Date(BASE_TIME - secondsAgo * 1000).toISOString(),
    });
  }
  return vehicles;
}