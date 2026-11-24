CUTOFFS = [
    (93, "A"),
    (90, "A-"),
    (88, "B+"),
    (83, "B"),
    (80, "B-"),
    (77, "C+"),
    (73, "C"),
    (70, "C-"),
    (60, "D"),
]


def letter(score: float) -> str:
    """Letter grade for a score from 0 to 100."""
    if not 0 <= score <= 100:
        raise ValueError(f"score out of range: {score}")
    points = round(score)
    for cutoff, grade in CUTOFFS:
        if points >= cutoff:
            return grade
    return "F"
