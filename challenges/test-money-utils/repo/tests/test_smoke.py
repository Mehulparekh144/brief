import sys
import unittest
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from money import add  # noqa: E402


class SmokeTest(unittest.TestCase):
    def test_add_two(self):
        self.assertEqual(add("1.10", "2.20"), Decimal("3.30"))


if __name__ == "__main__":
    unittest.main()
