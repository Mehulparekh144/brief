from inventory.allocate import by_priority
from inventory.models import OutOfStock


class Inventory:
    def __init__(self, warehouses):
        self.warehouses = list(warehouses)

    def available(self, sku: str) -> int:
        return sum(w.stock.get(sku, 0) for w in self.warehouses)

    def reserve(self, sku: str, qty: int) -> list:
        """Take qty units of sku for an order. Returns [(warehouse name, units taken), ...]."""
        if qty < 1:
            raise ValueError(f"qty must be at least 1, got {qty}")
        available = self.available(sku)
        if available < qty:
            raise OutOfStock(sku, qty, available)
        need = qty
        taken = []
        for w in by_priority(self.warehouses):
            have = w.stock.get(sku, 0)
            if have <= 0:
                continue
            take = min(have, need)
            w.stock[sku] = have - take
            taken.append((w.name, take))
            need -= take
            if need == 0:
                break
        return taken
