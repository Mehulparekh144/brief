export const ok = (body, type) => ({ status: 200, headers: { "content-type": type }, body });
export const forbidden = () => ({ status: 403, headers: {}, body: "forbidden" });
export const notFound = () => ({ status: 404, headers: {}, body: "not found" });
export const notAllowed = () => ({ status: 405, headers: {}, body: "method not allowed" });
