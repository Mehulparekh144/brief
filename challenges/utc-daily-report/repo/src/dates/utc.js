/** UTC calendar date ("YYYY-MM-DD") of an ISO timestamp with any offset. */
export const utcDate = (iso) => new Date(iso).toISOString().slice(0, 10);

/** The same instant, written in UTC with a Z. */
export const toUtcIso = (iso) => new Date(iso).toISOString();
