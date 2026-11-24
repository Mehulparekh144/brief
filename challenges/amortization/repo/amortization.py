def schedule(principal, annual_rate_percent, months):
    """Monthly payment plan for a fixed-rate loan. One row per month."""
    r = annual_rate_percent / 100 / 12
    payment = principal * r / (1 - (1 + r) ** -months)
    rows = []
    balance = principal
    for month in range(1, months + 1):
        interest = balance * r
        part = payment - interest
        balance -= part
        rows.append(
            {
                "month": month,
                "payment": round(payment, 2),
                "interest": round(interest, 2),
                "principal": round(part, 2),
                "balance": round(balance, 2),
            }
        )
    return rows
