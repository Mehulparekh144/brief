next_run(expr, after) in cron.py returns the next time a job runs. Today it understands only "*" and plain numbers. We need a small subset of cron, not all of it.

The expression has 5 fields, separated by spaces: minute hour day month weekday.

1. Not exactly 5 fields: ValueError.
2. Minute (0–59) and hour (0–23) accept:
   - `*`: every value.
   - `*/n`: 0, n, 2n, … (n is at least 1).
   - a number: `5`.
   - a range `a-b`: a to b, both included. a must not be more than b.
   - a list `a,b,c`: each item is a number or a range.
3. Day, month and weekday accept only `*`. Any other value raises ValueError. We do not support them yet.
4. A value out of range, a step of 0, a backwards range or text that is not a number raises ValueError.
5. The result is strictly after `after`. If `after` itself matches, return the next match.
6. The result has seconds and microseconds set to 0.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
