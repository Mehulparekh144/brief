from decimal import ROUND_HALF_UP, Decimal

RATE = 0.0825  # 8.25% sales tax


def tax_for(amount: float) -> float:
    """Sales tax in dollars, rounded half up to whole cents."""
    tax = Decimal(str(amount)) * Decimal(str(RATE))
    return float(tax.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
