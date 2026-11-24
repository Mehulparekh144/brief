from datetime import datetime
from pathlib import Path

from cron import next_run

CRONTAB = Path(__file__).resolve().parent / "crontab.txt"


def load_jobs(path: Path = CRONTAB) -> list:
    jobs = []
    for line in path.read_text().splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        *fields, name = line.split()
        jobs.append((name, " ".join(fields)))
    return jobs


def due_jobs(last_tick: datetime, now: datetime) -> list:
    """Names of jobs with a run time in (last_tick, now]."""
    return [name for name, expr in load_jobs() if next_run(expr, last_tick) <= now]
