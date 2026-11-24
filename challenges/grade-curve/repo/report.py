from collections import Counter

from curve import apply_curve
from grades import letter


def class_report(scores: dict, curve_points: float = 0) -> str:
    curved = apply_curve(scores, curve_points)
    lines = [f"{name:<12} {score:6.2f}  {letter(score)}" for name, score in sorted(curved.items())]
    counts = Counter(letter(s) for s in curved.values())
    lines.append("  ".join(f"{g}: {n}" for g, n in sorted(counts.items())))
    return "\n".join(lines)
