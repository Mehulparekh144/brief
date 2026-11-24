from orders.errors import InvalidTransition  # noqa: F401


def cancel_all(orders):
    """Cancel every order that can still be cancelled. Returns the ids that were cancelled."""
    cancelled = []
    for order in orders:
        if order.status != "delivered":
            order.cancel()
            cancelled.append(order.id)
    return cancelled


def ship_ready(orders):
    """Ship every packed order. Returns the ids that were shipped."""
    shipped = []
    for order in orders:
        if order.status in ("paid", "packed"):
            order.ship()
            shipped.append(order.id)
    return shipped
