import sys
import unittest
from datetime import datetime as dt
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from cron import next_run  # noqa: E402


class CronHiddenTest(unittest.TestCase):
    def test_hidden_strictly_after(self):
        self.assertEqual(next_run("15 10 * * *", dt(2026, 3, 1, 10, 15)), dt(2026, 3, 2, 10, 15))
        self.assertEqual(next_run("* * * * *", dt(2026, 3, 1, 10, 15)), dt(2026, 3, 1, 10, 16))

    def test_hidden_seconds_are_zero(self):
        self.assertEqual(next_run("* * * * *", dt(2026, 3, 1, 10, 15, 30, 500)), dt(2026, 3, 1, 10, 16))
        self.assertEqual(next_run("15 10 * * *", dt(2026, 3, 1, 10, 14, 59)), dt(2026, 3, 1, 10, 15))

    def test_hidden_steps(self):
        self.assertEqual(next_run("*/15 * * * *", dt(2026, 3, 1, 10, 16)), dt(2026, 3, 1, 10, 30))
        self.assertEqual(next_run("*/15 * * * *", dt(2026, 3, 1, 10, 45)), dt(2026, 3, 1, 11, 0))
        self.assertEqual(next_run("*/25 * * * *", dt(2026, 3, 1, 10, 50)), dt(2026, 3, 1, 11, 0))
        self.assertEqual(next_run("0 */6 * * *", dt(2026, 3, 1, 13, 0)), dt(2026, 3, 1, 18, 0))
        self.assertEqual(next_run("0 */6 * * *", dt(2026, 3, 1, 18, 0)), dt(2026, 3, 2, 0, 0))

    def test_hidden_ranges_and_lists(self):
        self.assertEqual(next_run("0,30 9-17 * * *", dt(2026, 3, 1, 12, 10)), dt(2026, 3, 1, 12, 30))
        self.assertEqual(next_run("0,30 9-17 * * *", dt(2026, 3, 1, 17, 30)), dt(2026, 3, 2, 9, 0))
        self.assertEqual(next_run("5,10-12 * * * *", dt(2026, 3, 1, 10, 5)), dt(2026, 3, 1, 10, 10))
        self.assertEqual(next_run("5,10-12 * * * *", dt(2026, 3, 1, 10, 12)), dt(2026, 3, 1, 11, 5))
        self.assertEqual(next_run("0 22,1-2 * * *", dt(2026, 3, 1, 22, 0)), dt(2026, 3, 2, 1, 0))

    def test_hidden_rolls_over_month_and_year(self):
        self.assertEqual(next_run("0 0 * * *", dt(2026, 12, 31, 23, 59)), dt(2027, 1, 1, 0, 0))
        self.assertEqual(next_run("59 23 * * *", dt(2026, 2, 28, 23, 59)), dt(2026, 3, 1, 23, 59))

    def test_hidden_day_fields_only_star(self):
        for expr in ("0 9 1 * *", "0 9 * 1 *", "0 9 * * 1", "0 9 * * MON", "0 9 */2 * *", "0 9 * 1-6 *"):
            with self.assertRaises(ValueError, msg=expr):
                next_run(expr, dt(2026, 3, 1))

    def test_hidden_invalid_expressions(self):
        bad = ["60 * * * *", "* 24 * * *", "*/0 * * * *", "30-10 * * * *", "* * * *", "* * * * * *",
               "a * * * *", "-1 * * * *", "1,,2 * * * *", ""]
        for expr in bad:
            with self.assertRaises(ValueError, msg=repr(expr)):
                next_run(expr, dt(2026, 3, 1))


if __name__ == "__main__":
    unittest.main()
