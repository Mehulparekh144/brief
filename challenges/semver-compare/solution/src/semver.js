const ID = "[0-9A-Za-z-]+";
const VERSION = new RegExp(`^v?(\\d+)\\.(\\d+)\\.(\\d+)(?:-(${ID}(?:\\.${ID})*))?(?:\\+${ID}(?:\\.${ID})*)?$`);

function parse(v) {
  const m = typeof v === "string" && VERSION.exec(v);
  if (!m) throw new TypeError(`invalid version: ${v}`);
  return { nums: m.slice(1, 4).map(Number), pre: m[4] ? m[4].split(".") : [] };
}

const sign = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const isNum = (id) => /^\d+$/.test(id);

function compareIds(x, y) {
  if (isNum(x) && isNum(y)) return sign(Number(x) - Number(y));
  if (isNum(x) !== isNum(y)) return isNum(x) ? -1 : 1;
  return x < y ? -1 : x > y ? 1 : 0;
}

/** -1 when a < b, 0 when equal, 1 when a > b. */
export function compare(a, b) {
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i++) if (pa.nums[i] !== pb.nums[i]) return sign(pa.nums[i] - pb.nums[i]);
  // No prerelease sorts after any prerelease.
  if (!pa.pre.length || !pb.pre.length) return sign(pb.pre.length - pa.pre.length);
  for (let i = 0; i < Math.min(pa.pre.length, pb.pre.length); i++) {
    const c = compareIds(pa.pre[i], pb.pre[i]);
    if (c) return c;
  }
  return sign(pa.pre.length - pb.pre.length);
}
