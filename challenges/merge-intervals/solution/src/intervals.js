/** Joins overlapping or touching [start, end] intervals. Does not change the input. */
export function merge(intervals) {
  for (const [s, e] of intervals) if (s > e) throw new RangeError(`bad interval [${s}, ${e}]`);
  const out = [];
  for (const [s, e] of [...intervals].sort((a, b) => a[0] - b[0])) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}
