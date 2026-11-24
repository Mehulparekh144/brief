/** The API itself. */
export const handle = (req) => ({ status: 200, headers: {}, body: `hello ${req.apiKey}` });
