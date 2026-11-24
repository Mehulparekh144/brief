from orders.errors import InvalidTransition


def cancel_all(orders):
    """Cancel every order that can still be cancelled. Returns the ids that were cancelled."""
    cancelled = []
    for order in orders:
        try:
            order.cancel()
            cancelled.append(order.id)
        except InvalidTransition:
            pass  # shipped or already final: leave it as it is
    return cancelled


def ship_ready(orders):
    """Ship every packed order. Returns the ids that were shipped."""
    shipped = []
    for order in orders:
        if order.status == "packed":
            order.ship()
            shipped.append(order.id)
    return shipped
