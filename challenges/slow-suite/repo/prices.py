from tax import tax_for


def line_total(price: float, qty: int) -> float:
    return round(price * qty, 2)


def receipt_totals(lines: list[tuple[float, int]]) -> dict:
    subtotal = round(sum(line_total(p, q) for p, q in lines), 2)
    tax = tax_for(subtotal)
    return {"subtotal": subtotal, "tax": tax, "total": round(subtotal + tax, 2)}
