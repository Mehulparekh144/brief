import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from tokenizer import tokenize  # noqa: E402


class SmokeTest(unittest.TestCase):
    def test_simple(self):
        self.assertEqual(tokenize("a + 1"), ["a", "+", "1"])


if __name__ == "__main__":
    unittest.main()
