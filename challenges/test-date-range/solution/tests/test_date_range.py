import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from date_range import expand  # noqa: E402

CASES = [
    ("2026-03-01..2026-03-03", ["2026-03-01", "2026-03-02", "2026-03-03"]),
    ("2026-03-01", ["2026-03-01"]),
    ("2026-03-01..2026-03-01", ["2026-03-01"]),
    (" 2026-03-01 .. 2026-03-02 ", ["2026-03-01", "2026-03-02"]),
    ("2026-01-31..2026-02-01", ["2026-01-31", "2026-02-01"]),
    ("2028-02-28..2028-03-01", ["2028-02-28", "2028-02-29", "2028-03-01"]),
    ("2026-01-01..2026-01-31", [f"2026-01-{d:02d}" for d in range(1, 32)]),
]
ERRORS = ["2026-03-02..2026-03-01", "", "2026-02-30", "2026-3-1", "2026-01-01..2026-02-01"]


class DateRangeTest(unittest.TestCase):
    def test_cases(self):
        for text, expected in CASES:
            with self.subTest(text=text):
                self.assertEqual(expand(text), expected)

    def test_errors(self):
        for text in ERRORS:
            with self.subTest(text=text), self.assertRaises(ValueError):
                expand(text)


if __name__ == "__main__":
    unittest.main()
