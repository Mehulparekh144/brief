`find_conflicts(meetings)` in `schedule.py` finds double-booked rooms. A meeting is a dict like `{"id": "m1", "room": "Atlas", "start": "09:00", "end": "10:00"}`. The current version has several bugs. Rewrite it with these rules:

1. Two meetings conflict when they are in the same room and their times overlap.
2. Room names match without case and without spaces at the ends: `"Atlas"` and `" atlas "` are the same room.
3. Touching is not a conflict: a meeting that ends at 10:00 and one that starts at 10:00 are fine.
4. Times are `"H:MM"` or `"HH:MM"`, 24-hour clock. Compare them as times: `"9:30"` is before `"10:00"`.
5. A meeting whose end is not after its start raises `ValueError`.
6. Return a list of `(a, b)` tuples of ids, with `a < b`. Each pair is in the list once.
7. Sort the list. Ids are strings and compare as strings, so `"m10"` comes before `"m2"`.

Keep the signature. Do not change `booking.py`.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
