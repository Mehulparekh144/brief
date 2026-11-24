/** Starts the health listener. `listen` is passed in so tests do not open a port. */
export function startServer(config, listen) {
  listen(config.port, config.host);
  const debug = config.debug ? " (debug)" : "";
  return `listening on ${config.host}:${config.port} with ${config.workers} workers${debug}`;
}
