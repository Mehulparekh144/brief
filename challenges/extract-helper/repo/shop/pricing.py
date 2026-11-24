def line_total(price, qty):
    """Price of one order line, rounded to cents."""
    if isinstance(price, bool) or not isinstance(price, (int, float)) or price <= 0:
        raise ValueError(f"price must be > 0, got {price}")
    if isinstance(qty, bool) or not isinstance(qty, (int, float)) or qty <= 0:
        raise ValueError(f"qty must be > 0, got {qty}")
    return round(price * qty, 2)
