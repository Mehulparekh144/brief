from orders.errors import InvalidTransition

ALLOWED = {
    "new": ("paid", "cancelled"),
    "paid": ("packed", "cancelled"),
    "packed": ("shipped", "cancelled"),
    "shipped": ("delivered",),
    "delivered": (),
    "cancelled": (),
}


class Order:
    def __init__(self, order_id):
        self.id = order_id
        self.status = "new"
        self.history = []

    @property
    def is_final(self):
        return not ALLOWED[self.status]

    def transition(self, to):
        if to not in ALLOWED:
            raise ValueError(f"unknown state: {to}")
        if self.is_final:
            raise InvalidTransition(f"order {self.id} is {self.status} and cannot change")
        if to not in ALLOWED[self.status]:
            raise InvalidTransition(f"cannot move order {self.id} from {self.status} to {to}")
        self.history.append((self.status, to))
        self.status = to

    def pay(self):
        self.transition("paid")

    def pack(self):
        self.transition("packed")

    def ship(self):
        self.transition("shipped")

    def deliver(self):
        self.transition("delivered")

    def cancel(self):
        self.transition("cancelled")
