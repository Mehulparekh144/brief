# sales-report

Daily sales totals for a date range, like `2026-03-01..2026-03-07`.

- `date_range.py` – `expand(text)`, a range to a list of ISO dates (at most 31 days)
- `report.py` – `daily_totals(sales, period)`

Run the tests with `python3 -m unittest discover -s tests -v`.
