from money import add, format_usd, split


def invoice_total(lines) -> str:
    """lines: (description, amount) pairs. Returns the formatted total."""
    return format_usd(add(*(amount for _, amount in lines)))


def installments(total, count: int) -> list:
    return [format_usd(part) for part in split(total, count)]
