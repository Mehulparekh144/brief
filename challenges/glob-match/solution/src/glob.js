const GLOBSTAR = Symbol("**");
const escapeRe = (c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One pattern segment as an anchored regex. */
function segmentRe(seg) {
  let re = "";
  for (let i = 0; i < seg.length; i++) {
    const c = seg[i];
    if (c === "\\" && i + 1 < seg.length) re += escapeRe(seg[++i]);
    else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else re += escapeRe(c);
  }
  return new RegExp(`^${re}$`);
}

/** True when the whole `path` matches the glob `pattern`. "**" as a segment matches zero or more segments. */
export function match(pattern, path) {
  const pats = pattern.split("/").map((seg) => (seg === "**" ? GLOBSTAR : segmentRe(seg)));
  const segs = path.split("/");
  const go = (i, j) => {
    if (i === pats.length) return j === segs.length;
    if (pats[i] === GLOBSTAR) {
      for (let k = j; k <= segs.length; k++) if (go(i + 1, k)) return true;
      return false;
    }
    return j < segs.length && pats[i].test(segs[j]) && go(i + 1, j + 1);
  };
  return go(0, 0);
}
