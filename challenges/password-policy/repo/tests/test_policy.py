import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from policy import check  # noqa: E402


class PolicyTest(unittest.TestCase):
    def test_good_password(self):
        self.assertEqual(check("Sunflower-Garden-42", "alice"), [])

    def test_short_password(self):
        self.assertIn("LENGTH", check("short1", "alice"))


if __name__ == "__main__":
    unittest.main()
