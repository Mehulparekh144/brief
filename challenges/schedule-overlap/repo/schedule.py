def find_conflicts(meetings):
    """Pairs of meeting ids that are booked in the same room at the same time."""
    conflicts = []
    for i, a in enumerate(meetings):
        for b in meetings[i + 1:]:
            if a["room"] == b["room"] and a["start"] <= b["end"] and b["start"] <= a["end"]:
                conflicts.append((a["id"], b["id"]))
    return conflicts
