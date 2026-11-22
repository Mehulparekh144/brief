import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from duration import parse_duration  # noqa: E402


class SmokeTest(unittest.TestCase):
    def test_minutes(self):
        self.assertEqual(parse_duration("5m"), 300)


if __name__ == "__main__":
    unittest.main()
