humanize() in humanize.py shows durations in the job dashboard. Today it shows only one unit and always says "hours", even for 1 hour. Make it follow these rules:

1. Units: day (86400 s), hour (3600 s), minute (60 s), second. Days are the largest unit. No weeks, months or years.
2. Show the two largest units that are not 0, joined by ", ": 3900 → "1 hour, 5 minutes".
3. Skip a unit that is 0, also between the two: 86700 → "1 day, 5 minutes".
4. Drop the rest. Do not round: 7199 → "1 hour, 59 minutes".
5. If only one unit is not 0, show only that unit: 7200 → "2 hours".
6. Use the singular for 1 ("1 minute") and the plural for all other numbers ("2 minutes").
7. 0 → "0 seconds".
8. A negative number raises ValueError.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
