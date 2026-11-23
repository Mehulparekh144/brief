import { zoneFor } from "./zones.js";

const BASE = { domestic: 5, "north-america": 12, europe: 18, world: 25 };
const PER_KG = { domestic: 1, "north-america": 3, europe: 4, world: 6 };

export function shippingFor(weightKg, country) {
  const zone = zoneFor(country);
  return Math.round((BASE[zone] + PER_KG[zone] * Math.ceil(weightKg)) * 100) / 100;
}
