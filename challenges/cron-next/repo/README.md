# job-runner

Runs maintenance jobs on a schedule. Schedules use cron syntax (see `crontab.txt`).

- `cron.py` – finds the next run time of a cron expression
- `scheduler.py` – loads `crontab.txt` and picks the jobs that are due

Run the tests with `python3 -m unittest discover -s tests -v`.
