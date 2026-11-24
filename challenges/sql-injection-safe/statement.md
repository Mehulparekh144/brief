The admin search box is open to SQL injection: `search_users()` in users/store.py puts the typed text straight into the SQL. `find_by_email()` has the same problem. Fix both, and make the search behave the way the admins expect.

- Pass user text only as SQL parameters (`?`). No user text inside the SQL string. A hidden test records every SQL string sent.
- `find_by_email(email)`: exact match, as now.
- `search_users(name)`: first strip spaces. Empty text returns `[]`.
- Match names that start with the text, in any case: "an" finds "Ana" and "andrew", not "Diana".
- `%`, `_` and `\` in the text are plain characters. Escape each one with a backslash and use `ESCAPE '\'`.
- Sort by name without case (`COLLATE NOCASE`), then by id.
- Results stay a list of dicts with `id`, `name` and `email`.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
