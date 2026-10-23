import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateVehicles } from './vehicleGenerator.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, '../src/data/vehicles.json');

const vehicles = generateVehicles(400, 42);

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(vehicles, null, 2) + '\n');

console.log(`Wrote ${vehicles.length} vehicles to src/data/vehicles.json`);