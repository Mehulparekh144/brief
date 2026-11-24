import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from grades import letter  # noqa: E402


class GradesTest(unittest.TestCase):
    def test_top_grade(self):
        self.assertEqual(letter(95), "A")

    def test_failing_grade(self):
        self.assertEqual(letter(50), "F")


if __name__ == "__main__":
    unittest.main()
