from decimal import ROUND_HALF_UP, Decimal

CENT = Decimal("0.01")


def to_money(value) -> Decimal:
    """An int, str or Decimal as a Decimal in cents."""
    if isinstance(value, float):
        raise TypeError("use str or Decimal for money, not float")
    return Decimal(value).quantize(CENT, rounding=ROUND_HALF_UP)


def add(*amounts) -> Decimal:
    """Sum of the amounts."""
    total = Decimal("0.00")
    for amount in amounts:
        total += to_money(amount)
    return total


def split(total, parts: int) -> list:
    """Split total into `parts` amounts."""
    if parts < 1:
        raise ValueError("parts must be at least 1")
    cents = int(to_money(total) * 100)
    base, extra = divmod(cents, parts)
    return [Decimal(base + (1 if i < extra else 0)) / 100 for i in range(parts)]


def format_usd(amount) -> str:
    """The amount as a US dollar string."""
    value = to_money(amount)
    sign = "-" if value < 0 else ""
    return f"{sign}${abs(value):,.2f}"
