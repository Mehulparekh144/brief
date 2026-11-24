import path from "node:path";

const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".md": "text/markdown",
  ".txt": "text/plain",
};

export const mimeType = (file) => TYPES[path.extname(file)] ?? "application/octet-stream";
