import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from phone import to_e164  # noqa: E402


class PhoneTest(unittest.TestCase):
    def test_us_with_punctuation(self):
        self.assertEqual(to_e164("(617) 555-0142"), "+16175550142")

    def test_us_with_dots(self):
        self.assertEqual(to_e164("617.555.0142"), "+16175550142")


if __name__ == "__main__":
    unittest.main()
