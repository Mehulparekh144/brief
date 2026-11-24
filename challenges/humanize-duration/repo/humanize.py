def humanize(seconds: int) -> str:
    """A duration in words, for example "1 hour, 5 minutes"."""
    if seconds < 60:
        return f"{seconds} seconds"
    if seconds < 3600:
        return f"{seconds // 60} minutes"
    if seconds < 86400:
        return f"{seconds // 3600} hours"
    return f"{seconds // 86400} days"
