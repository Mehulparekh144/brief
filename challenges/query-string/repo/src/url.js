/** { q: "red shoes", page: 2 } -> "q=red%20shoes&page=2" */
export function buildQuery(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map((x) => `${encodeURIComponent(k)}=${encodeURIComponent(x)}`))
    .join("&");
}
