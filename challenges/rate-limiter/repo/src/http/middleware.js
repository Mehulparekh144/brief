/** Rejects a request with 429 when its API key has no token left. */
export function rateLimit(registry) {
  return (req, next) => {
    const bucket = registry.bucketFor(req.apiKey, req.plan);
    if (!bucket.allow()) return { status: 429, headers: { "retry-after": "1" }, body: "too many requests" };
    return next(req);
  };
}
