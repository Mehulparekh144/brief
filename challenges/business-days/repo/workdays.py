from datetime import date, timedelta


def add_business_days(start: date, n: int, holidays: set) -> date:
    """Return the date n business days after start."""
    day = start
    while n > 0:
        day += timedelta(days=1)
        if day.weekday() < 5:
            n -= 1
    return day
