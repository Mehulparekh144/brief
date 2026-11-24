def _minutes(hhmm):
    hours, minutes = hhmm.split(":")
    return int(hours) * 60 + int(minutes)


def find_conflicts(meetings):
    """Sorted (a, b) id pairs, a < b, of meetings that overlap in the same room. Touching is not a conflict."""
    parsed = []
    for m in meetings:
        start, end = _minutes(m["start"]), _minutes(m["end"])
        if end <= start:
            raise ValueError(f"meeting {m['id']} does not end after it starts")
        parsed.append((m["room"].strip().lower(), start, end, m["id"]))
    pairs = set()
    for i, (room_a, start_a, end_a, id_a) in enumerate(parsed):
        for room_b, start_b, end_b, id_b in parsed[i + 1:]:
            if room_a == room_b and start_a < end_b and start_b < end_a:
                pairs.add((min(id_a, id_b), max(id_a, id_b)))
    return sorted(pairs)
