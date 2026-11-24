from date_range import expand


def daily_totals(sales, period):
    """sales: list of {"day": "YYYY-MM-DD", "cents": int}. period: a range like "2026-03-01..2026-03-07".
    Returns {day: cents} for every day of the period, with 0 for days without sales."""
    totals = {day: 0 for day in expand(period)}
    for sale in sales:
        if sale["day"] in totals:
            totals[sale["day"]] += sale["cents"]
    return totals
