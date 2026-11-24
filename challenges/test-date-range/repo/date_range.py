import re
from datetime import date, timedelta

MAX_DAYS = 31
_DATE = re.compile(r"([0-9]{4})-([0-9]{2})-([0-9]{2})")


def _parse(text):
    m = _DATE.fullmatch(text.strip())
    if not m:
        raise ValueError(f"bad date: {text!r}")
    return date(*map(int, m.groups()))  # date() rejects days that do not exist, like 2026-02-30


def expand(text):
    """'2026-03-01..2026-03-03' -> ['2026-03-01', '2026-03-02', '2026-03-03']. A single date gives one day."""
    start_text, sep, end_text = text.partition("..")
    start = _parse(start_text)
    end = _parse(end_text) if sep else start
    if end < start:
        raise ValueError(f"range ends before it starts: {text!r}")
    days = (end - start).days + 1
    if days > MAX_DAYS:
        raise ValueError(f"range is longer than {MAX_DAYS} days: {text!r}")
    return [(start + timedelta(days=i)).isoformat() for i in range(days)]
