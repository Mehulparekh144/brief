import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from orders.errors import InvalidTransition  # noqa: E402
from orders.order import Order  # noqa: E402
from orders.service import cancel_all, ship_ready  # noqa: E402

STATES = ["new", "paid", "packed", "shipped", "delivered", "cancelled"]
TABLE = {
    "new": {"paid", "cancelled"},
    "paid": {"packed", "cancelled"},
    "packed": {"shipped", "cancelled"},
    "shipped": {"delivered"},
    "delivered": set(),
    "cancelled": set(),
}
PATH = {"new": [], "paid": ["paid"], "packed": ["paid", "packed"], "shipped": ["paid", "packed", "shipped"],
        "delivered": ["paid", "packed", "shipped", "delivered"], "cancelled": ["cancelled"]}


def order_in(state, order_id=7):
    order = Order(order_id)
    for step in PATH[state]:
        order.transition(step)
    return order


class OrderHiddenTest(unittest.TestCase):
    def test_hidden_history(self):
        order = Order(1)
        self.assertEqual(order.history, [])
        for step in ["paid", "packed", "shipped", "delivered"]:
            order.transition(step)
        self.assertEqual(order.status, "delivered")
        self.assertEqual(order.history, [("new", "paid"), ("paid", "packed"), ("packed", "shipped"), ("shipped", "delivered")])

    def test_hidden_full_table(self):
        for start in STATES:
            for to in STATES:
                with self.subTest(start=start, to=to):
                    order = order_in(start)
                    if to in TABLE[start]:
                        order.transition(to)
                        self.assertEqual(order.status, to)
                        continue
                    with self.assertRaises(InvalidTransition) as ctx:
                        order.transition(to)
                    if TABLE[start]:
                        self.assertEqual(str(ctx.exception), f"cannot move order 7 from {start} to {to}")
                    else:
                        self.assertEqual(str(ctx.exception), f"order 7 is {start} and cannot change")

    def test_hidden_unknown_state(self):
        for start in ["new", "cancelled"]:
            with self.subTest(start=start):
                with self.assertRaises(ValueError) as ctx:
                    order_in(start).transition("lost")
                self.assertNotIsInstance(ctx.exception, InvalidTransition)
                self.assertEqual(str(ctx.exception), "unknown state: lost")

    def test_hidden_failed_move_changes_nothing(self):
        order = order_in("paid")
        for bad in ["shipped", "lost", "new"]:
            with self.assertRaises(ValueError if bad == "lost" else InvalidTransition):
                order.transition(bad)
        self.assertEqual(order.status, "paid")
        self.assertEqual(order.history, [("new", "paid")])

    def test_hidden_methods_use_transition(self):
        real = Order.transition
        for method, start, to in [("pay", "new", "paid"), ("pack", "paid", "packed"), ("ship", "packed", "shipped"),
                                  ("deliver", "shipped", "delivered"), ("cancel", "packed", "cancelled")]:
            with self.subTest(method=method):
                order = order_in(start)
                with mock.patch.object(Order, "transition", autospec=True, side_effect=real) as spy:
                    getattr(order, method)()
                self.assertEqual(len(spy.call_args_list), 1)
                args = spy.call_args.args[1:] + tuple(spy.call_args.kwargs.values())
                self.assertEqual(args, (to,))
                self.assertEqual(order.history[-1], (start, to))

    def test_hidden_ship_needs_packing(self):
        order = order_in("paid", order_id=12)
        with self.assertRaises(InvalidTransition) as ctx:
            order.ship()
        self.assertEqual(str(ctx.exception), "cannot move order 12 from paid to shipped")

    def test_hidden_is_final(self):
        self.assertEqual({s: order_in(s).is_final for s in STATES}, {s: s in ("delivered", "cancelled") for s in STATES})

    def test_hidden_service_skips_what_cannot_move(self):
        orders = [order_in("new", 1), order_in("shipped", 2), order_in("cancelled", 3), order_in("packed", 4), order_in("delivered", 5)]
        self.assertEqual(cancel_all(orders), [1, 4])
        self.assertEqual([o.status for o in orders], ["cancelled", "shipped", "cancelled", "cancelled", "delivered"])
        batch = [order_in("paid", 6), order_in("packed", 7), order_in("new", 8)]
        self.assertEqual(ship_ready(batch), [7])
        self.assertEqual([o.status for o in batch], ["paid", "shipped", "new"])


if __name__ == "__main__":
    unittest.main()
