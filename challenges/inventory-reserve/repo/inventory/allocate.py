def by_priority(warehouses):
    """Warehouses in the order reserve() uses them."""
    return sorted(warehouses, key=lambda w: w.priority, reverse=True)
