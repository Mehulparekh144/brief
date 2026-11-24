from datetime import date, timedelta


def add_business_days(start: date, n: int, holidays: set) -> date:
    """Return the date n business days after start (before it when n < 0)."""

    def is_business(d: date) -> bool:
        return d.weekday() < 5 and d not in holidays

    day = start
    if n == 0:
        while not is_business(day):
            day += timedelta(days=1)
        return day
    step = timedelta(days=1 if n > 0 else -1)
    left = abs(n)
    while left:
        day += step
        if is_business(day):
            left -= 1
    return day
