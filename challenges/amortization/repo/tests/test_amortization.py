import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from amortization import schedule  # noqa: E402


class AmortizationTest(unittest.TestCase):
    def test_one_row_per_month(self):
        rows = schedule(1000, 12, 12)
        self.assertEqual([row["month"] for row in rows], list(range(1, 13)))

    def test_first_payment(self):
        self.assertAlmostEqual(float(schedule(1000, 12, 12)[0]["payment"]), 88.85, places=2)


if __name__ == "__main__":
    unittest.main()
