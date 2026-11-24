/**
 * Flags: --port 7000, --port=7000 and --debug (true).
 * "true", "false" and numbers are converted. --log-level becomes log_level.
 */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const arg = argv[i].slice(2);
    const eq = arg.indexOf("=");
    let key = arg;
    let value;
    if (eq !== -1) [key, value] = [arg.slice(0, eq), arg.slice(eq + 1)];
    else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) value = argv[++i];
    else value = "true";
    out[key.replace(/-/g, "_")] = parseValue(value);
  }
  return out;
}

function parseValue(v) {
  if (v === "true") return true;
  if (v === "false") return false;
  if (v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return v;
}
