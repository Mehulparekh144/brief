from humanize import humanize


def time_left(done: int, total: int, elapsed_seconds: int) -> str:
    """Estimate of the time left, from the work done so far."""
    if done == 0:
        return "unknown"
    left = elapsed_seconds * (total - done) // done
    return humanize(left) + " left"


def status_line(job: dict) -> str:
    return f"{job['name']}: {job['done']}/{job['total']}, {time_left(job['done'], job['total'], job['elapsed'])}"
