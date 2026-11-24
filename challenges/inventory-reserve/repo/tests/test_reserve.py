import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from inventory import Inventory, OutOfStock, Warehouse  # noqa: E402


class ReserveTest(unittest.TestCase):
    def test_one_warehouse(self):
        inv = Inventory([Warehouse("main", 1, {"SKU-1": 10})])
        self.assertEqual(inv.reserve("SKU-1", 4), [("main", 4)])
        self.assertEqual(inv.available("SKU-1"), 6)

    def test_out_of_stock(self):
        inv = Inventory([Warehouse("main", 1, {"SKU-1": 2})])
        with self.assertRaises(OutOfStock):
            inv.reserve("SKU-1", 3)


if __name__ == "__main__":
    unittest.main()
