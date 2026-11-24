"""Hidden check: the user's tests must follow the table format and catch each broken version of tokenizer.py."""
import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
SOURCE = (ROOT / "tokenizer.py").read_text()
USER_TESTS = ROOT / "tests" / "test_tokenizer.py"
MUTANTS = {
    "decimals split": (r"(?P<number>\d+(?:\.\d+)?)", r"(?P<number>\d+)"),
    "two-character operators split": ("(?P<op><=|>=|==|!=|[-+*/()<>=])", "(?P<op>[-+*/()<>=]|<=|>=|==|!=)"),
    "!= not known": ("==|!=|", "==|"),
    "digits not allowed in names": ("[A-Za-z_][A-Za-z0-9_]*", "[A-Za-z_][A-Za-z_]*"),
    "underscores not allowed in names": ("[A-Za-z_][A-Za-z0-9_]*", "[A-Za-z][A-Za-z0-9]*"),
    "spaces kept as tokens": ('if m.lastgroup != "space":', "if True:"),
    "strings stop at a space": ('"[^"]*"', '"[^" ]*"'),
}


def _user_module():
    spec = importlib.util.spec_from_file_location("user_tokenizer_tests", USER_TESTS)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class TokenizerHarnessTest(unittest.TestCase):
    def test_hidden_tests_file_exists(self):
        self.assertTrue(USER_TESTS.exists(), "tests/test_tokenizer.py is missing")

    def test_hidden_table_format(self):
        from tokenizer import tokenize

        cases = getattr(_user_module(), "CASES", None)
        self.assertIsInstance(cases, list, "define CASES = [(text, tokens), ...]")
        self.assertGreaterEqual(len(cases), 8, "CASES needs at least 8 rows")
        for row in cases:
            self.assertEqual(len(row), 2, f"CASES row must be (text, tokens): {row!r}")
            text, tokens = row
            self.assertIsInstance(tokens, list, f"tokens must be a list: {row!r}")
            self.assertEqual(tokenize(text), tokens, f"CASES row is wrong: {text!r}")
        self.assertIn([], [tokens for _, tokens in cases], "add the empty text case")

    def test_hidden_one_loop_with_subtest(self):
        source = USER_TESTS.read_text()
        self.assertIn("for ", source)
        self.assertIn("in CASES", source)
        self.assertIn("self.subTest(", source)

    def test_hidden_tokenizer_unchanged(self):
        for old, _new in MUTANTS.values():
            self.assertIn(old, SOURCE, "tokenizer.py was changed")

    def test_hidden_tests_catch_every_mutant(self):
        self.assertTrue(USER_TESTS.exists())
        survived = []
        for name, (old, new) in MUTANTS.items():
            with tempfile.TemporaryDirectory() as tmp:
                (Path(tmp) / "tests").mkdir()
                (Path(tmp) / "tokenizer.py").write_text(SOURCE.replace(old, new, 1))
                shutil.copy(USER_TESTS, Path(tmp) / "tests" / "test_tokenizer.py")
                r = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests"], cwd=tmp, capture_output=True, timeout=60)
                if r.returncode == 0:
                    survived.append(name)
        self.assertEqual(survived, [], f"your tests did not catch: {', '.join(survived)}")


if __name__ == "__main__":
    unittest.main()
