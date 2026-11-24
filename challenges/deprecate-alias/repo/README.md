# dates

Date helpers for billing and reports.

```python
from dates import parse_date

parse_date("2026-03-01")  # datetime.date(2026, 3, 1)
```

- `dates/parsing.py`: parse ISO dates (`YYYY-MM-DD`).
- `dates/billing.py`: due dates and overdue checks for invoices.
- `dates/reports.py`: group rows by month.

Other teams import `parse_date` from this package, so its public names must keep working.

Run the tests with `python3 -m unittest discover -s tests -v`.
