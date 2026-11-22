const QUIET = process.env.SHOP_QUIET !== "0";

export function log(event, data = {}) {
  if (!QUIET) console.log(JSON.stringify({ at: new Date().toISOString(), event, ...data }));
}
