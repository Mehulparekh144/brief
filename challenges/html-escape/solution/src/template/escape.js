const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Makes text safe to put in HTML text and quoted attributes. */
export const escapeHtml = (text) => text.replace(/[&<>"']/g, (c) => ENTITIES[c]);
