import sys
import unittest
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from money import add, format_usd, split  # noqa: E402


class AddTest(unittest.TestCase):
    def test_two_amounts(self):
        self.assertEqual(add("1.10", "2.20"), Decimal("3.30"))

    def test_many_amounts(self):
        self.assertEqual(add("1", "2", "3", "4"), Decimal("10.00"))

    def test_rounds_half_up(self):
        self.assertEqual(add("0.125"), Decimal("0.13"))

    def test_refuses_floats(self):
        with self.assertRaises(TypeError):
            add(0.1, "1.00")


class SplitTest(unittest.TestCase):
    def test_extra_cents_first(self):
        self.assertEqual(split("10.00", 3), [Decimal("3.34"), Decimal("3.33"), Decimal("3.33")])

    def test_sum_is_total(self):
        self.assertEqual(sum(split("100.00", 7)), Decimal("100.00"))


class FormatTest(unittest.TestCase):
    def test_thousands(self):
        self.assertEqual(format_usd("1234.5"), "$1,234.50")

    def test_negative(self):
        self.assertEqual(format_usd("-5"), "-$5.00")


if __name__ == "__main__":
    unittest.main()
