const ZONES = { US: "domestic", CA: "north-america", MX: "north-america", GB: "europe", DE: "europe", FR: "europe" };

export const zoneFor = (country) => ZONES[country] ?? "world";
