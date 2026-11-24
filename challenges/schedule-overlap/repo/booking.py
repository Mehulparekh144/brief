from schedule import find_conflicts


def can_book(existing, new):
    """True when the new meeting does not clash with any existing meeting."""
    return not any(new["id"] in pair for pair in find_conflicts(existing + [new]))
