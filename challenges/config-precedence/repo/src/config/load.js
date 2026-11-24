import { PREFIX, keyFromEnv } from "./envNames.js";

/**
 * Builds the final config from four layers.
 * defaults: built-in values. file: parsed config.json. env: process.env. cli: parsed flags.
 */
export function loadConfig(defaults, file = {}, env = {}, cli = {}) {
  const fromEnv = {};
  for (const [name, value] of Object.entries(env)) {
    if (name.startsWith(PREFIX)) fromEnv[keyFromEnv(name)] = value;
  }
  return { ...defaults, ...file, ...cli, ...fromEnv };
}
