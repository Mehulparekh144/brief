import sys
import unittest
from decimal import Decimal as D
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from amortization import schedule  # noqa: E402


def row(month, payment, interest, principal, balance):
    return {"month": month, "payment": D(payment), "interest": D(interest), "principal": D(principal), "balance": D(balance)}


class AmortizationHiddenTest(unittest.TestCase):
    def test_hidden_first_row(self):
        self.assertEqual(schedule(1000, 12, 12)[0], row(1, "88.85", "10.00", "78.85", "921.15"))

    def test_hidden_full_table(self):
        expected = [
            row(1, "168.34", "2.50", "165.84", "334.16"),
            row(2, "168.34", "1.67", "166.67", "167.49"),
            row(3, "168.33", "0.84", "167.49", "0.00"),
        ]
        self.assertEqual(schedule(500, 6, 3), expected)

    def test_hidden_accepts_str_float_decimal(self):
        expected = schedule(500, 6, 3)
        self.assertEqual(schedule("500", "6", 3), expected)
        self.assertEqual(schedule(500.0, 6.0, 3), expected)
        self.assertEqual(schedule(D("500.00"), D("6"), 3), expected)

    def test_hidden_money_is_decimal_cents(self):
        for r in schedule("2500", "4.5", 24):
            for key in ("payment", "interest", "principal", "balance"):
                self.assertIsInstance(r[key], D, key)
                self.assertEqual(r[key].as_tuple().exponent, -2, f"{key} in month {r['month']}: {r[key]}")

    def test_hidden_rounds_half_up(self):
        self.assertEqual(schedule("1000.50", 12, 3)[0]["interest"], D("10.01"))

    def test_hidden_last_payment_adjusts(self):
        rows = schedule(1000, 12, 12)
        self.assertEqual(rows[-2]["balance"], D("87.96"))
        self.assertEqual(rows[-1], row(12, "88.84", "0.88", "87.96", "0.00"))
        self.assertEqual(sum(r["principal"] for r in rows), D("1000.00"))

    def test_hidden_zero_rate(self):
        expected = [
            row(1, "333.33", "0.00", "333.33", "666.67"),
            row(2, "333.33", "0.00", "333.33", "333.34"),
            row(3, "333.34", "0.00", "333.34", "0.00"),
        ]
        self.assertEqual(schedule(1000, 0, 3), expected)

    def test_hidden_months_must_be_positive(self):
        for months in (0, -1):
            with self.assertRaises(ValueError):
                schedule(1000, 12, months)


if __name__ == "__main__":
    unittest.main()
