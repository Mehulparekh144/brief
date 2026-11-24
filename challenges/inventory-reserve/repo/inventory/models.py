from dataclasses import dataclass, field


@dataclass
class Warehouse:
    name: str
    priority: int
    stock: dict = field(default_factory=dict)  # sku -> units on hand


class OutOfStock(Exception):
    def __init__(self, sku: str, wanted: int, available: int):
        super().__init__(f"{sku}: wanted {wanted}, only {available} in stock")
        self.sku, self.wanted, self.available = sku, wanted, available
