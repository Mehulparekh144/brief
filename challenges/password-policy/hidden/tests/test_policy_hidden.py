import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from policy import check  # noqa: E402


class PolicyHiddenTest(unittest.TestCase):
    def test_hidden_accepted(self):
        self.assertEqual(check("Tr0ub4dor&3xyz", "alice"), [])

    def test_hidden_length_is_12(self):
        self.assertEqual(check("Abcdefgh1!x", "bob"), ["LENGTH"])
        self.assertEqual(check("Abcdefgh1!xy", "bob"), [])

    def test_hidden_each_character_class(self):
        self.assertEqual(check("abcdefgh1!xy", "bob"), ["UPPER"])
        self.assertEqual(check("ABCDEFGH1!XY", "bob"), ["LOWER"])
        self.assertEqual(check("Abcdefghi!xy", "bob"), ["DIGIT"])
        self.assertEqual(check("Abcdefgh12xy", "bob"), ["SYMBOL"])

    def test_hidden_space_is_a_symbol(self):
        self.assertEqual(check("Correct Horse 9", "bob"), [])

    def test_hidden_fixed_order(self):
        self.assertEqual(check("", "bob"), ["LENGTH", "UPPER", "LOWER", "DIGIT", "SYMBOL"])
        self.assertEqual(check("alice", "alice"), ["LENGTH", "UPPER", "DIGIT", "SYMBOL", "CONTAINS_USERNAME"])
        self.assertEqual(check("password", "pass"), ["LENGTH", "UPPER", "DIGIT", "SYMBOL", "CONTAINS_USERNAME", "COMMON"])

    def test_hidden_username_ignores_case(self):
        self.assertEqual(check("xxALICExx-2024", "alice"), ["CONTAINS_USERNAME"])
        self.assertEqual(check("Summer-Alice-99", "ALICE"), ["CONTAINS_USERNAME"])

    def test_hidden_empty_username_never_matches(self):
        self.assertEqual(check("Tr0ub4dor&3xyz", ""), [])

    def test_hidden_common_ignores_case(self):
        self.assertEqual(check("P@ssw0rd2024", "bob"), ["COMMON"])
        self.assertEqual(check("WELCOME@2024", "bob"), ["LOWER", "COMMON"])


if __name__ == "__main__":
    unittest.main()
