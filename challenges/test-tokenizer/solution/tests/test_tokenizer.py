import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from tokenizer import tokenize  # noqa: E402

CASES = [
    ("", []),
    ("42", ["42"]),
    ("3.14", ["3.14"]),
    ("rate_2", ["rate_2"]),
    ("x2 _y", ["x2", "_y"]),
    ("a <= 1", ["a", "<=", "1"]),
    ("a>=b", ["a", ">=", "b"]),
    ("a == b != c", ["a", "==", "b", "!=", "c"]),
    ("a+b", ["a", "+", "b"]),
    ("(1 - 2) * 3 / 4", ["(", "1", "-", "2", ")", "*", "3", "/", "4"]),
    ("a < b > c = d", ["a", "<", "b", ">", "c", "=", "d"]),
    ('name != "Bob Lee"', ["name", "!=", '"Bob Lee"']),
    ("  price   >= 9.5  ", ["price", ">=", "9.5"]),
]


class TokenizerTest(unittest.TestCase):
    def test_cases(self):
        for text, tokens in CASES:
            with self.subTest(text=text):
                self.assertEqual(tokenize(text), tokens)


if __name__ == "__main__":
    unittest.main()
