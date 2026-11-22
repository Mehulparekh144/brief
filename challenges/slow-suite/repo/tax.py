RATE = 0.0825  # 8.25% sales tax


def tax_for(amount: float) -> float:
    """Sales tax in dollars, rounded half up to whole cents."""
    return round(amount * RATE, 2)
