import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from date_range import expand  # noqa: E402


class SmokeTest(unittest.TestCase):
    def test_two_days(self):
        self.assertEqual(expand("2026-03-01..2026-03-02"), ["2026-03-01", "2026-03-02"])


if __name__ == "__main__":
    unittest.main()
