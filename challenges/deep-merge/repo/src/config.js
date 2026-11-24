import { DEFAULTS } from "./defaults.js";
import { merge } from "./merge.js";

/** The defaults with the user's settings on top. */
export function loadConfig(userSettings = {}) {
  const config = merge(DEFAULTS, userSettings);
  if (config.editor.tabSize < 1) config.editor.tabSize = 1;
  return config;
}
