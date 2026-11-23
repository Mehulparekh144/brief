import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from slug import slugify  # noqa: E402


class SlugTest(unittest.TestCase):
    def test_simple_title(self):
        self.assertEqual(slugify("Hello World"), "hello-world")

    def test_numbers_stay(self):
        self.assertEqual(slugify("Python 3"), "python-3")


if __name__ == "__main__":
    unittest.main()
