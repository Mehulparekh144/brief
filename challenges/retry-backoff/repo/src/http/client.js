import { RETRY_DEFAULTS } from "../config.js";
import { retry } from "../lib/retry.js";
import { HttpError, isRetryable } from "./errors.js";

/**
 * JSON client over a transport: (path) => Promise<{ status, body }>.
 * Retryable statuses are retried. Other errors fail at once.
 */
export function createClient({ transport, retryOptions = RETRY_DEFAULTS }) {
  return {
    async getJson(path) {
      const res = await retry(async () => {
        const r = await transport(path);
        if (isRetryable(r.status)) throw new HttpError(r.status, path);
        return r;
      }, retryOptions);
      if (res.status >= 400) throw new HttpError(res.status, path);
      return JSON.parse(res.body);
    },
  };
}
