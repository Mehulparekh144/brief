import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from duration import parse_duration  # noqa: E402

CASES = [("2h", 7200), ("5m", 300), ("9s", 9), ("1h30m", 5400), ("1h2m3s", 3723), (" 1H 30M ", 5400), ("0s", 0)]
ERRORS = ["", "   ", "5d", "30m1h", "1h2h", "10m5"]


class DurationTest(unittest.TestCase):
    def test_cases(self):
        for text, seconds in CASES:
            with self.subTest(text=text):
                self.assertEqual(parse_duration(text), seconds)

    def test_errors(self):
        for text in ERRORS:
            with self.subTest(text=text), self.assertRaises(ValueError):
                parse_duration(text)


if __name__ == "__main__":
    unittest.main()
