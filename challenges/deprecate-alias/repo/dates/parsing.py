import datetime as dt
import re

_ISO = re.compile(r"(\d{4})-(\d{2})-(\d{2})")


def parse_date(text):
    """'2026-03-01' -> date(2026, 3, 1). Spaces around the text are ignored."""
    m = _ISO.fullmatch(text.strip())
    if not m:
        raise ValueError(f"not an ISO date: {text!r}")
    return dt.date(*map(int, m.groups()))
