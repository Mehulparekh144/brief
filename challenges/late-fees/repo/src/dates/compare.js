const DAY_MS = 86_400_000;
const startOfDayUTC = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

/** Whole calendar days (UTC) from a to b. Positive when b is on a later day. */
export function daysBetween(a, b) {
  return Math.round((startOfDayUTC(b) - startOfDayUTC(a)) / DAY_MS);
}

export function isSameDay(a, b) {
  return startOfDayUTC(a) === startOfDayUTC(b);
}

export function isBefore(a, b) {
  return a.getTime() < b.getTime();
}
