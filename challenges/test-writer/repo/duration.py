import re

_PART = re.compile(r"(\d+)([hms])")
_SECONDS = {"h": 3600, "m": 60, "s": 1}


def parse_duration(text: str) -> int:
    """'1h30m' -> 5400. Units h, m, s, in that order, each at most once. Spaces and case are ignored."""
    s = text.replace(" ", "").lower()
    if not s:
        raise ValueError("empty duration")
    pos, total, last = 0, 0, -1
    for m in _PART.finditer(s):
        if m.start() != pos:
            raise ValueError(f"bad duration: {text!r}")
        order = "hms".index(m.group(2))
        if order <= last:
            raise ValueError(f"units out of order or repeated: {text!r}")
        last = order
        total += int(m.group(1)) * _SECONDS[m.group(2)]
        pos = m.end()
    if pos != len(s):
        raise ValueError(f"bad duration: {text!r}")
    return total
