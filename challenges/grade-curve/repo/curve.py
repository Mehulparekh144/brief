def apply_curve(scores: dict, points: float) -> dict:
    """Add curve points to every score. No score goes above 100."""
    return {student: min(100.0, score + points) for student, score in scores.items()}


def curve_to_mean(scores: dict, target_mean: float) -> dict:
    mean = sum(scores.values()) / len(scores)
    return apply_curve(scores, max(0.0, target_mean - mean))
