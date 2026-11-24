import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from workdays import add_business_days  # noqa: E402

# Thanksgiving (Thu) and the day after, Christmas (Fri), New Year (Fri).
HOL = {date(2026, 11, 26), date(2026, 11, 27), date(2026, 12, 25), date(2027, 1, 1)}


class WorkdaysHiddenTest(unittest.TestCase):
    def test_hidden_skips_holidays(self):
        self.assertEqual(add_business_days(date(2026, 11, 25), 1, HOL), date(2026, 11, 30))
        self.assertEqual(add_business_days(date(2026, 12, 24), 1, HOL), date(2026, 12, 28))

    def test_hidden_long_span(self):
        self.assertEqual(add_business_days(date(2026, 12, 21), 10, HOL), date(2027, 1, 6))

    def test_hidden_negative(self):
        self.assertEqual(add_business_days(date(2026, 11, 23), -1, set()), date(2026, 11, 20))
        self.assertEqual(add_business_days(date(2026, 11, 30), -1, HOL), date(2026, 11, 25))
        self.assertEqual(add_business_days(date(2026, 12, 28), -3, HOL), date(2026, 12, 22))

    def test_hidden_start_on_weekend(self):
        self.assertEqual(add_business_days(date(2026, 11, 21), 1, set()), date(2026, 11, 23))
        self.assertEqual(add_business_days(date(2026, 11, 22), -1, set()), date(2026, 11, 20))

    def test_hidden_start_on_holiday(self):
        self.assertEqual(add_business_days(date(2026, 11, 26), 1, HOL), date(2026, 11, 30))
        self.assertEqual(add_business_days(date(2026, 11, 26), -1, HOL), date(2026, 11, 25))

    def test_hidden_zero_on_business_day(self):
        self.assertEqual(add_business_days(date(2026, 11, 25), 0, HOL), date(2026, 11, 25))

    def test_hidden_zero_moves_forward(self):
        self.assertEqual(add_business_days(date(2026, 11, 21), 0, set()), date(2026, 11, 23))
        self.assertEqual(add_business_days(date(2026, 11, 26), 0, HOL), date(2026, 11, 30))
        self.assertEqual(add_business_days(date(2026, 12, 27), 0, HOL), date(2026, 12, 28))


if __name__ == "__main__":
    unittest.main()
