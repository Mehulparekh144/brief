import sys
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from workdays import add_business_days  # noqa: E402


class WorkdaysTest(unittest.TestCase):
    def test_next_day(self):
        self.assertEqual(add_business_days(date(2026, 11, 17), 1, set()), date(2026, 11, 18))

    def test_friday_to_monday(self):
        self.assertEqual(add_business_days(date(2026, 11, 20), 1, set()), date(2026, 11, 23))


if __name__ == "__main__":
    unittest.main()
