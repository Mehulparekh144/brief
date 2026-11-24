import { merge } from "./intervals.js";
import { fromMinutes, toMinutes } from "./time.js";

/** Events like { start: "09:00", end: "10:30" } -> merged busy blocks. */
export function busyBlocks(events) {
  if (!events.length) return [];
  return merge(events.map((e) => [toMinutes(e.start), toMinutes(e.end)])).map(([s, e]) => ({ start: fromMinutes(s), end: fromMinutes(e) }));
}

/** Free slots between dayStart and dayEnd. */
export function freeSlots(events, dayStart = "09:00", dayEnd = "17:00") {
  const free = [];
  let cursor = dayStart;
  for (const b of busyBlocks(events)) {
    if (toMinutes(b.start) > toMinutes(cursor)) free.push({ start: cursor, end: b.start });
    if (toMinutes(b.end) > toMinutes(cursor)) cursor = b.end;
  }
  if (toMinutes(dayEnd) > toMinutes(cursor)) free.push({ start: cursor, end: dayEnd });
  return free;
}
