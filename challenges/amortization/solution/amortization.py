from decimal import ROUND_HALF_UP, Decimal

CENT = Decimal("0.01")


def _cents(value: Decimal) -> Decimal:
    return value.quantize(CENT, rounding=ROUND_HALF_UP)


def schedule(principal, annual_rate_percent, months: int) -> list:
    """Monthly payment plan for a fixed-rate loan. One row per month."""
    if months < 1:
        raise ValueError("months must be at least 1")
    balance = _cents(Decimal(str(principal)))
    r = Decimal(str(annual_rate_percent)) / 100 / 12
    if r == 0:
        payment = _cents(balance / months)
    else:
        payment = _cents(balance * r / (1 - (1 + r) ** -months))
    rows = []
    for month in range(1, months + 1):
        interest = _cents(balance * r)
        if month == months:
            part, pay = balance, balance + interest
        else:
            part, pay = payment - interest, payment
        balance -= part
        rows.append({"month": month, "payment": pay, "interest": interest, "principal": part, "balance": balance})
    return rows
