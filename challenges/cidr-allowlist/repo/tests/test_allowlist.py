import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from allowlist import is_allowed, load_allowlist  # noqa: E402


class AllowlistTest(unittest.TestCase):
    def test_address_inside_network(self):
        self.assertTrue(is_allowed("10.20.3.4", load_allowlist(["10.20.0.0/16"])))

    def test_address_outside_network(self):
        self.assertFalse(is_allowed("192.168.1.1", load_allowlist(["10.20.0.0/16"])))


if __name__ == "__main__":
    unittest.main()
