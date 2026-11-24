import math


def require_positive(name, value):
    """Return value if it is a finite int or float above 0 (bool is not a number here); else raise ValueError."""
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ValueError(f"{name} must be a positive number, got {value!r}")
    return value
