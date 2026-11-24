import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from inventory import Inventory, OutOfStock, Warehouse  # noqa: E402


def stock(inv, sku="SKU-1"):
    return {w.name: w.stock.get(sku, 0) for w in inv.warehouses}


class ReserveHiddenTest(unittest.TestCase):
    def test_hidden_priority_one_first(self):
        inv = Inventory([Warehouse("backup", 2, {"SKU-1": 10}), Warehouse("main", 1, {"SKU-1": 10})])
        self.assertEqual(inv.reserve("SKU-1", 4), [("main", 4)])
        self.assertEqual(stock(inv), {"backup": 10, "main": 6})

    def test_hidden_spills_to_next_warehouse(self):
        inv = Inventory([Warehouse("far", 3, {"SKU-1": 9}), Warehouse("backup", 2, {"SKU-1": 10}), Warehouse("main", 1, {"SKU-1": 3})])
        self.assertEqual(inv.reserve("SKU-1", 5), [("main", 3), ("backup", 2)])
        self.assertEqual(stock(inv), {"far": 9, "backup": 8, "main": 0})

    def test_hidden_same_priority_by_name(self):
        inv = Inventory([Warehouse("west", 1, {"SKU-1": 5}), Warehouse("east", 1, {"SKU-1": 5}), Warehouse("north", 2, {"SKU-1": 5})])
        self.assertEqual(inv.reserve("SKU-1", 7), [("east", 5), ("west", 2)])

    def test_hidden_all_or_nothing(self):
        inv = Inventory([Warehouse("main", 1, {"SKU-1": 3}), Warehouse("backup", 2, {"SKU-1": 2})])
        with self.assertRaises(OutOfStock):
            inv.reserve("SKU-1", 6)
        self.assertEqual(stock(inv), {"main": 3, "backup": 2})

    def test_hidden_exact_total_then_empty(self):
        inv = Inventory([Warehouse("main", 1, {"SKU-1": 3}), Warehouse("backup", 2, {"SKU-1": 2})])
        self.assertEqual(inv.reserve("SKU-1", 5), [("main", 3), ("backup", 2)])
        with self.assertRaises(OutOfStock):
            inv.reserve("SKU-1", 1)
        self.assertEqual(stock(inv), {"main": 0, "backup": 0})

    def test_hidden_qty_below_one(self):
        inv = Inventory([Warehouse("main", 1, {"SKU-1": 3})])
        for qty in (0, -3):
            with self.assertRaises(ValueError):
                inv.reserve("SKU-1", qty)
        self.assertEqual(stock(inv), {"main": 3})

    def test_hidden_skips_warehouses_without_the_sku(self):
        inv = Inventory([Warehouse("main", 1, {"SKU-2": 5}), Warehouse("backup", 2, {"SKU-1": 5})])
        self.assertEqual(inv.reserve("SKU-1", 2), [("backup", 2)])
        self.assertEqual(inv.available("SKU-1"), 3)
        self.assertEqual(inv.available("SKU-2"), 5)

    def test_hidden_sku_missing_everywhere(self):
        inv = Inventory([Warehouse("main", 1, {"SKU-2": 5})])
        with self.assertRaises(OutOfStock):
            inv.reserve("SKU-1", 1)
        self.assertEqual(inv.warehouses[0].stock, {"SKU-2": 5})


if __name__ == "__main__":
    unittest.main()
