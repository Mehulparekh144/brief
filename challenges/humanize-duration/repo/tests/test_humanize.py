import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from humanize import humanize  # noqa: E402


class HumanizeTest(unittest.TestCase):
    def test_seconds(self):
        self.assertEqual(humanize(45), "45 seconds")

    def test_minutes(self):
        self.assertEqual(humanize(120), "2 minutes")


if __name__ == "__main__":
    unittest.main()
