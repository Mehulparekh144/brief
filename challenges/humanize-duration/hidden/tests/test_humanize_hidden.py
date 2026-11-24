import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from humanize import humanize  # noqa: E402


class HumanizeHiddenTest(unittest.TestCase):
    def test_hidden_two_largest_units(self):
        self.assertEqual(humanize(3900), "1 hour, 5 minutes")
        self.assertEqual(humanize(90061), "1 day, 1 hour")

    def test_hidden_skips_zero_units(self):
        self.assertEqual(humanize(86700), "1 day, 5 minutes")
        self.assertEqual(humanize(3605), "1 hour, 5 seconds")

    def test_hidden_drops_the_rest(self):
        self.assertEqual(humanize(7199), "1 hour, 59 minutes")
        self.assertEqual(humanize(3599), "59 minutes, 59 seconds")
        self.assertEqual(humanize(172799), "1 day, 23 hours")

    def test_hidden_singular_and_plural(self):
        self.assertEqual(humanize(1), "1 second")
        self.assertEqual(humanize(61), "1 minute, 1 second")
        self.assertEqual(humanize(7322), "2 hours, 2 minutes")

    def test_hidden_one_unit_only(self):
        self.assertEqual(humanize(7200), "2 hours")
        self.assertEqual(humanize(86400), "1 day")
        self.assertEqual(humanize(60), "1 minute")

    def test_hidden_zero(self):
        self.assertEqual(humanize(0), "0 seconds")

    def test_hidden_days_are_largest(self):
        self.assertEqual(humanize(1_000_000), "11 days, 13 hours")
        self.assertEqual(humanize(365 * 86400), "365 days")

    def test_hidden_negative_raises(self):
        with self.assertRaises(ValueError):
            humanize(-1)


if __name__ == "__main__":
    unittest.main()
