import datetime as dt
import re
import warnings

_ISO = re.compile(r"(\d{4})-(\d{2})-(\d{2})")


def parse_iso_date(text):
    """'2026-03-01' -> date(2026, 3, 1). Spaces around the text are ignored."""
    m = _ISO.fullmatch(text.strip())
    if not m:
        raise ValueError(f"not an ISO date: {text!r}")
    return dt.date(*map(int, m.groups()))


def parse_date(text):
    """Deprecated: use parse_iso_date()."""
    warnings.warn("parse_date() is deprecated; use parse_iso_date()", DeprecationWarning, stacklevel=2)
    return parse_iso_date(text)
