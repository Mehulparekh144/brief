Rename `parse_date` to `parse_iso_date`. Other teams still call `parse_date`, so keep it working for one more release, with a warning.

- In dates/parsing.py, rename the function to `parse_iso_date`. Its behavior and error messages stay the same.
- Keep `parse_date(text)` in the same module as a deprecated wrapper. It returns what `parse_iso_date` returns.
- Each call to `parse_date` emits a `DeprecationWarning` with exactly this message: `parse_date() is deprecated; use parse_iso_date()`
- The warning must point at the caller's line, not at parsing.py (`stacklevel=2`).
- dates/billing.py and dates/reports.py call `parse_iso_date`. They must never trigger the warning.
- `dates/__init__.py` exports both names.
- Do not change tests/. They use the old name on purpose.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
