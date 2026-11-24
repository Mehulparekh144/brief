def restock(stock, sku, qty):
    """Add qty units of sku to the stock dict. Returns the new count."""
    if not isinstance(qty, (int, float)) or qty <= 0:
        raise ValueError(f"invalid qty: {qty!r}")
    stock[sku] = stock.get(sku, 0) + qty
    return stock[sku]


def in_stock(stock, sku):
    return stock.get(sku, 0) > 0
