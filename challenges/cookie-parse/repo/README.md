# web-session

Session cookies for the web server.

- `src/cookies.js` – parseCookies(header): the Cookie request header to an object
- `src/serialize.js` – serializeCookie(name, value, options) for Set-Cookie
- `src/session.js` – reads the session id from a request

Run the tests with `node --test test/*.test.js`.
