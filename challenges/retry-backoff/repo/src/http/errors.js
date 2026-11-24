export class HttpError extends Error {
  constructor(status, path) {
    super(`HTTP ${status} for ${path}`);
    this.name = "HttpError";
    this.status = status;
  }
}

/** 429 and 5xx are worth another try. Other errors are not. */
export const isRetryable = (status) => status === 429 || status >= 500;
