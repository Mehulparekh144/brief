import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from allowlist import is_allowed, load_allowlist  # noqa: E402


class AllowlistHiddenTest(unittest.TestCase):
    def test_hidden_prefix_is_numeric_not_text(self):
        al = load_allowlist(["10.0.0.0/8"])
        self.assertTrue(is_allowed("10.255.1.1", al))
        self.assertFalse(is_allowed("100.1.2.3", al))
        self.assertFalse(is_allowed("1.10.0.0", al))
        al = load_allowlist(["192.168.1.0/24"])
        self.assertTrue(is_allowed("192.168.1.200", al))
        self.assertFalse(is_allowed("192.168.10.1", al))
        al = load_allowlist(["172.16.0.0/12"])
        self.assertTrue(is_allowed("172.31.255.255", al))
        self.assertFalse(is_allowed("172.32.0.1", al))

    def test_hidden_bare_address_is_one_host(self):
        al = load_allowlist(["8.8.8.8"])
        self.assertTrue(is_allowed("8.8.8.8", al))
        self.assertFalse(is_allowed("8.8.8.80", al))
        self.assertFalse(is_allowed("8.8.8.9", al))

    def test_hidden_bad_ip_is_false_and_never_raises(self):
        al = load_allowlist(["10.0.0.0/8"])
        for ip in ["", "abc", "10.0.0.256", "10.0.0", "010.0.0.1", " 10.0.0.1", "10.0.0.1 ", "10.0.0.1/32",
                   "::1", "::ffff:10.0.0.1", None, 167772161, b"10.0.0.1", b"\n\x00\x00\x01"]:
            with self.subTest(ip=ip):
                self.assertIs(is_allowed(ip, al), False)

    def test_hidden_bad_entry_raises_on_load(self):
        for entry in ["10.0.0.0/33", "10.0.0/8", "banana", "10.0.0.1/8", "fe80::/10", "10.0.0.0/-1", "10.0.0.0/8 office"]:
            with self.subTest(entry=entry), self.assertRaises(ValueError):
                load_allowlist(["10.20.0.0/16", entry])

    def test_hidden_too_broad_is_rejected(self):
        for entry in ["0.0.0.0/0", "128.0.0.0/1", "0.0.0.0/7"]:
            with self.subTest(entry=entry), self.assertRaises(ValueError):
                load_allowlist([entry])
        self.assertTrue(is_allowed("10.1.1.1", load_allowlist(["10.0.0.0/8"])))

    def test_hidden_comments_blank_lines_and_spaces(self):
        al = load_allowlist(["# office", "", "   ", "  10.0.0.0/8  ", "   # 0.0.0.0/0", "\t192.168.1.0/24\n"])
        self.assertTrue(is_allowed("10.1.1.1", al))
        self.assertTrue(is_allowed("192.168.1.9", al))
        self.assertFalse(is_allowed("11.0.0.1", al))

    def test_hidden_empty_allowlist_allows_nothing(self):
        self.assertIs(is_allowed("10.0.0.1", load_allowlist([])), False)
        self.assertIs(is_allowed("10.0.0.1", load_allowlist(["# nothing yet", ""])), False)


if __name__ == "__main__":
    unittest.main()
