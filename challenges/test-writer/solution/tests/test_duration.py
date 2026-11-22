import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from duration import parse_duration  # noqa: E402


class DurationTest(unittest.TestCase):
    def test_single_units(self):
        self.assertEqual(parse_duration("2h"), 7200)
        self.assertEqual(parse_duration("5m"), 300)
        self.assertEqual(parse_duration("9s"), 9)

    def test_combinations(self):
        self.assertEqual(parse_duration("1h30m"), 5400)
        self.assertEqual(parse_duration("1h2m3s"), 3723)

    def test_spaces_and_case(self):
        self.assertEqual(parse_duration(" 1H 30M "), 5400)

    def test_zero(self):
        self.assertEqual(parse_duration("0s"), 0)

    def test_errors(self):
        for bad in ["", "   ", "5d", "30m1h", "1h2h", "10m5"]:
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                parse_duration(bad)


if __name__ == "__main__":
    unittest.main()
