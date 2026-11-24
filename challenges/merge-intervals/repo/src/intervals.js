/** Joins overlapping [start, end] intervals. */
export function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0]];
  for (const cur of intervals.slice(1)) {
    const last = out[out.length - 1];
    if (cur[0] < last[1]) last[1] = cur[1];
    else out.push(cur);
  }
  return out;
}
