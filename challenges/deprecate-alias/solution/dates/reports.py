from collections import defaultdict

from dates.parsing import parse_iso_date


def by_month(rows):
    """{'2026-03': total, ...} from rows like {'date': '2026-03-01', 'amount': 10}, in month order."""
    totals = defaultdict(int)
    for row in rows:
        totals[parse_iso_date(row["date"]).strftime("%Y-%m")] += row["amount"]
    return dict(sorted(totals.items()))


def first_and_last(rows):
    days = sorted(parse_iso_date(row["date"]) for row in rows)
    return (days[0], days[-1]) if days else None
