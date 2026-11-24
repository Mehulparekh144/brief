def by_priority(warehouses):
    """Warehouses in the order reserve() uses them: priority 1 first, then by name."""
    return sorted(warehouses, key=lambda w: (w.priority, w.name))
