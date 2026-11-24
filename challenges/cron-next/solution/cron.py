import re
from datetime import datetime, timedelta


def _int(text: str, top: int) -> int:
    if not re.fullmatch(r"[0-9]+", text) or int(text) > top:
        raise ValueError(f"bad cron value: {text!r}")
    return int(text)


def _values(field: str, top: int) -> set:
    if field == "*":
        return set(range(top + 1))
    if field.startswith("*/"):
        step = field[2:]
        if not re.fullmatch(r"[0-9]+", step) or int(step) < 1:
            raise ValueError(f"bad cron step: {field!r}")
        return set(range(0, top + 1, int(step)))
    out = set()
    for item in field.split(","):
        lo, dash, hi = item.partition("-")
        a = _int(lo, top)
        b = _int(hi, top) if dash else a
        if a > b:
            raise ValueError(f"backwards range: {item!r}")
        out.update(range(a, b + 1))
    return out


def next_run(expr: str, after: datetime) -> datetime:
    """Next time the cron expression fires, strictly after `after`."""
    fields = expr.split()
    if len(fields) != 5:
        raise ValueError(f"cron needs 5 fields: {expr!r}")
    minute, hour, *rest = fields
    if any(f != "*" for f in rest):
        raise ValueError(f"day, month and weekday must be '*': {expr!r}")
    minutes, hours = _values(minute, 59), _values(hour, 23)
    t = after.replace(second=0, microsecond=0) + timedelta(minutes=1)
    # Day fields are always "*", so a match comes within one day.
    for _ in range(24 * 60):
        if t.minute in minutes and t.hour in hours:
            return t
        t += timedelta(minutes=1)
    raise ValueError(f"no run time for {expr!r}")
