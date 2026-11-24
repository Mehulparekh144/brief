`expand(text)` in `date_range.py` turns a date range like `"2026-03-01..2026-03-03"` into a list of ISO dates. It has one smoke test. Write the real tests in our team's table format.

Format (every test file in our codebase looks like this):
- File: `tests/test_date_range.py`, with `unittest` (there is no pytest). Start it like `tests/test_smoke.py`.
- `CASES`: a list of `(text, expected)` pairs. `expected` is the full list of ISO date strings.
- `ERRORS`: a list of texts that must raise `ValueError`.
- One test loops over `CASES` and one loops over `ERRORS`, each with `self.subTest`.

Cover:
- A range includes both ends. A single date gives one day.
- Spaces around the dates are ignored.
- A range across a month end, and one across 29 February 2028.
- Exactly 31 days is allowed. 32 days is an error.
- Errors: the end before the start, an empty text, a day that does not exist (`"2026-02-30"`), a date without zero padding (`"2026-3-1"`).

Do not change `date_range.py` or `tests/test_smoke.py`.

A hidden check reads `CASES` and `ERRORS` and runs your file against 7 broken versions of `expand()`. Your tests must fail on each of them.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
