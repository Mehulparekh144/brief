import contextlib
import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from shop import inventory, pricing, shipping, validators  # noqa: E402


@contextlib.contextmanager
def spy(module):
    """Replace require_positive (in validators and wherever the module holds it) with a mock that never raises."""
    fake = mock.Mock(side_effect=lambda name, value: value)
    real = validators.require_positive
    with contextlib.ExitStack() as stack:
        stack.enter_context(mock.patch.object(validators, "require_positive", fake))
        for attr, value in list(vars(module).items()):
            if value is real:
                stack.enter_context(mock.patch.object(module, attr, fake))
        yield fake


def calls(fake):
    return [tuple(c.args) + tuple(c.kwargs[k] for k in ("name", "value") if k in c.kwargs) for c in fake.call_args_list]


class ValidatorsHiddenTest(unittest.TestCase):
    def test_hidden_valid_values_returned(self):
        self.assertEqual(validators.require_positive("price", 2), 2)
        self.assertEqual(validators.require_positive("weight_kg", 0.25), 0.25)

    def test_hidden_exact_message(self):
        for value, shown in [(-1, "-1"), (0, "0"), ("3", "'3'"), (True, "True"), (None, "None"), (float("nan"), "nan"), (float("inf"), "inf")]:
            with self.subTest(value=value), self.assertRaises(ValueError) as ctx:
                validators.require_positive("price", value)
            self.assertEqual(str(ctx.exception), f"price must be a positive number, got {shown}")

    def test_hidden_pricing_uses_helper(self):
        with spy(pricing) as fake:
            self.assertEqual(pricing.line_total(-1, 2), -2)
        self.assertCountEqual(calls(fake), [("price", -1), ("qty", 2)])

    def test_hidden_inventory_uses_helper(self):
        with spy(inventory) as fake:
            self.assertEqual(inventory.restock({}, "A1", -3), -3)
        self.assertEqual(calls(fake), [("qty", -3)])

    def test_hidden_shipping_uses_helper(self):
        with spy(shipping) as fake:
            self.assertEqual(shipping.shipping_cost(-1), 5.0)
        self.assertEqual(calls(fake), [("weight_kg", -1)])

    def test_hidden_modules_raise_the_new_message(self):
        cases = [
            (lambda: pricing.line_total(2, 0), "qty must be a positive number, got 0"),
            (lambda: pricing.line_total(True, 1), "price must be a positive number, got True"),
            (lambda: inventory.restock({}, "A1", "5"), "qty must be a positive number, got '5'"),
            (lambda: shipping.shipping_cost(float("nan")), "weight_kg must be a positive number, got nan"),
        ]
        for call, message in cases:
            with self.subTest(message=message), self.assertRaises(ValueError) as ctx:
                call()
            self.assertEqual(str(ctx.exception), message)

    def test_hidden_behavior_kept(self):
        stock = {"A1": 1}
        with self.assertRaises(ValueError):
            inventory.restock(stock, "A1", -1)
        self.assertEqual(stock, {"A1": 1})
        self.assertEqual(pricing.line_total(0.1, 3), 0.3)
        self.assertEqual(shipping.shipping_cost(2.5), 11.25)


if __name__ == "__main__":
    unittest.main()
