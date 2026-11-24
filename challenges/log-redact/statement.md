Our logs leak secrets. Make `redact(record)` in logkit/redact.py clean every record before it is written.

- `redact` returns a new object. It never changes the record it gets.
- Sensitive keys: `password`, `token`, `secret`, `api_key`. Compare the whole key, in any case: `API_KEY` and `Password` match, `password_hint` does not.
- The value of a sensitive key becomes `"***"`, whatever its type (string, number, dict, list, None).
- Look inside nested dicts and lists, at any depth.
- In all other string values, mask emails: keep the first letter and the domain. `ana.lee@example.com` becomes `a***@example.com`.
- In strings, `Bearer <token>` becomes `Bearer ***`. "Bearer" can be in any case and keeps its case; only the token (the non-space characters after it) changes.
- Keys, numbers, booleans and None stay as they are.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
