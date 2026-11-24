import { parseArgs } from "./cli/args.js";
import { DEFAULTS } from "./config/defaults.js";
import { readConfigFile } from "./config/file.js";
import { loadConfig } from "./config/load.js";

/** Config for this process. Pass argv, env and readFile so tests can fake them. */
export function resolveConfig({ argv = process.argv.slice(2), env = process.env, readFile } = {}) {
  const { config: path = "config.json", ...cli } = parseArgs(argv);
  return loadConfig(DEFAULTS, readConfigFile(path, readFile), env, cli);
}

export { startServer } from "./server/start.js";
