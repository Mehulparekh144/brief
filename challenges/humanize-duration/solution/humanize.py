UNITS = (("day", 86400), ("hour", 3600), ("minute", 60), ("second", 1))


def humanize(seconds: int) -> str:
    """A duration in words, for example "1 hour, 5 minutes"."""
    if seconds < 0:
        raise ValueError("duration cannot be negative")
    if seconds == 0:
        return "0 seconds"
    parts = []
    for name, size in UNITS:
        count, seconds = divmod(seconds, size)
        if count:
            parts.append(f"{count} {name}" + ("" if count == 1 else "s"))
    return ", ".join(parts[:2])
