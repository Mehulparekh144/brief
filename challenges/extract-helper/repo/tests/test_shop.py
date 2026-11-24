import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from shop.inventory import restock  # noqa: E402
from shop.pricing import line_total  # noqa: E402
from shop.shipping import shipping_cost  # noqa: E402


class ShopTest(unittest.TestCase):
    def test_happy_paths(self):
        self.assertEqual(line_total(19.99, 3), 59.97)
        self.assertEqual(restock({"A1": 2}, "A1", 5), 7)
        self.assertEqual(shipping_cost(0.5), 5.0)
        self.assertEqual(shipping_cost(3), 13.5)

    def test_bad_values_raise(self):
        for call in (lambda: line_total(0, 1), lambda: line_total(5, -1), lambda: restock({}, "A1", 0), lambda: shipping_cost(-2)):
            with self.assertRaises(ValueError):
                call()


if __name__ == "__main__":
    unittest.main()
