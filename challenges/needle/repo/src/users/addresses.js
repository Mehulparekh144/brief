import { zoneFor } from "../shipping/zones.js";

export function normalizeAddress({ line1, city, country, postcode }) {
  return {
    line1: line1.trim(),
    city: city.trim(),
    country: country.trim().toUpperCase(),
    postcode: postcode.replace(/\s+/g, "").toUpperCase(),
    zone: zoneFor(country.trim().toUpperCase()),
  };
}
