from prices import receipt_totals


def render(lines: list[tuple[str, float, int]]) -> str:
    totals = receipt_totals([(p, q) for _, p, q in lines])
    body = [f"{name:<20}{q:>3} x {p:>7.2f}" for name, p, q in lines]
    body += ["-" * 34, f"{'Subtotal':<26}{totals['subtotal']:>8.2f}", f"{'Tax':<26}{totals['tax']:>8.2f}", f"{'Total':<26}{totals['total']:>8.2f}"]
    return "\n".join(body)
