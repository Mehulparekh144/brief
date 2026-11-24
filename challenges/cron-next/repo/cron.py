from datetime import datetime, timedelta


def _matches(field: str, value: int) -> bool:
    return field == "*" or int(field) == value


def next_run(expr: str, after: datetime) -> datetime:
    """Next time the cron expression fires after `after`."""
    minute, hour, day, month, weekday = expr.split()
    t = after
    for _ in range(60 * 24 * 366):
        if _matches(minute, t.minute) and _matches(hour, t.hour):
            return t
        t += timedelta(minutes=1)
    raise ValueError(f"no run time for {expr!r}")
