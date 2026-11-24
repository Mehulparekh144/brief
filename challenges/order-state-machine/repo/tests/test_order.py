import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from orders.errors import InvalidTransition  # noqa: E402
from orders.order import Order  # noqa: E402
from orders.service import cancel_all  # noqa: E402


class OrderTest(unittest.TestCase):
    def test_full_lifecycle(self):
        order = Order(1)
        order.pay()
        order.pack()
        order.ship()
        order.deliver()
        self.assertEqual(order.status, "delivered")

    def test_cancel(self):
        order = Order(2)
        order.cancel()
        self.assertEqual(order.status, "cancelled")
        done = Order(3)
        done.pay()
        done.pack()
        done.ship()
        done.deliver()
        with self.assertRaises(InvalidTransition):
            done.cancel()
        self.assertEqual(cancel_all([Order(4), Order(5)]), [4, 5])


if __name__ == "__main__":
    unittest.main()
