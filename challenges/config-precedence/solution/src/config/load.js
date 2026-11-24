import { PREFIX, keyFromEnv } from "./envNames.js";

/**
 * Builds the final config from four layers. Precedence: cli > env > file > defaults.
 * defaults: built-in values. file: parsed config.json. env: process.env. cli: parsed flags.
 * Env values are converted to the type of the default; unknown keys are ignored.
 */
export function loadConfig(defaults, file = {}, env = {}, cli = {}) {
  const fromEnv = {};
  for (const [name, value] of Object.entries(env)) {
    if (!name.startsWith(PREFIX)) continue;
    const key = keyFromEnv(name);
    if (!Object.hasOwn(defaults, key)) continue;
    fromEnv[key] = coerce(value, defaults[key]);
  }
  return { ...defaults, ...file, ...fromEnv, ...cli };
}

function coerce(value, like) {
  if (typeof like === "number") return Number(value);
  if (typeof like === "boolean") return value === "true";
  return value;
}
