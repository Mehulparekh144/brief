from orders.errors import InvalidTransition


class Order:
    def __init__(self, order_id):
        self.id = order_id
        self.status = "new"

    def pay(self):
        if self.status != "new":
            raise InvalidTransition("already paid")
        self.status = "paid"

    def pack(self):
        self.status = "packed"

    def ship(self):
        if self.status not in ("paid", "packed"):
            raise InvalidTransition("not paid")
        self.status = "shipped"

    def deliver(self):
        self.status = "delivered"

    def cancel(self):
        if self.status == "delivered":
            raise InvalidTransition("too late to cancel")
        self.status = "cancelled"
