def low_stock(warehouses, threshold: int = 5) -> list:
    """(warehouse name, sku, units) for every sku at or below the threshold, sorted."""
    rows = []
    for w in warehouses:
        for sku, units in w.stock.items():
            if units <= threshold:
                rows.append((w.name, sku, units))
    return sorted(rows)
