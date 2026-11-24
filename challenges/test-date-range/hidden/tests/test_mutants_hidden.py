"""Hidden check: the user's tests must follow the table format and catch each broken version of date_range.py."""
import hashlib
import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
USER_TESTS = ROOT / "tests" / "test_date_range.py"
SOURCE = (ROOT / "date_range.py").read_text()
SOURCE_SHA256 = "24d5197c534c0d3ff3c02827937001fe3644e603a773c954b1f2a6cb15ab40ae"
MUTANTS = {
    "end day left out": ("days = (end - start).days + 1", "days = (end - start).days"),
    "reversed range allowed": ('    if end < start:\n        raise ValueError(f"range ends before it starts: {text!r}")\n', ""),
    "31 days rejected": ("if days > MAX_DAYS:", "if days >= MAX_DAYS:"),
    "32 days allowed": ("MAX_DAYS = 31", "MAX_DAYS = 32"),
    "spaces not ignored": ("_DATE.fullmatch(text.strip())", "_DATE.fullmatch(text)"),
    "single date rejected": ("end = _parse(end_text) if sep else start", "end = _parse(end_text)"),
    "no zero padding needed": ("([0-9]{4})-([0-9]{2})-([0-9]{2})", "([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})"),
}


def _user_module():
    spec = importlib.util.spec_from_file_location("user_date_range_tests", USER_TESTS)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _user_tests_pass(source):
    """Run only the user's test file in a temp copy with `source` as date_range.py."""
    with tempfile.TemporaryDirectory() as tmp:
        (Path(tmp) / "tests").mkdir()
        (Path(tmp) / "date_range.py").write_text(source)
        shutil.copy(USER_TESTS, Path(tmp) / "tests" / "test_date_range.py")
        r = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests"], cwd=tmp, capture_output=True, timeout=60)
        return r.returncode == 0


class MutantTest(unittest.TestCase):
    def test_hidden_tests_file_exists(self):
        self.assertTrue(USER_TESTS.exists(), "tests/test_date_range.py is missing")

    def test_hidden_table_format(self):
        from date_range import expand

        mod = _user_module()
        cases, errors = getattr(mod, "CASES", None), getattr(mod, "ERRORS", None)
        self.assertIsInstance(cases, list, "define CASES = [(text, [iso dates]), ...]")
        self.assertIsInstance(errors, list, "define ERRORS = [text, ...]")
        self.assertGreaterEqual(len(cases), 6, "CASES needs at least 6 rows")
        self.assertGreaterEqual(len(errors), 5, "ERRORS needs at least 5 texts")
        for text, expected in cases:
            self.assertIsInstance(expected, list, f"CASES row {text!r}: expected must be a list of ISO date strings")
            self.assertEqual(expand(text), expected, f"CASES row is wrong: {text!r}")
        for text in errors:
            with self.assertRaises(ValueError, msg=f"ERRORS entry does not raise: {text!r}"):
                expand(text)

    def test_hidden_date_range_unchanged(self):
        self.assertEqual(hashlib.sha256(SOURCE.encode()).hexdigest(), SOURCE_SHA256, "date_range.py was changed")
        self.assertTrue(USER_TESTS.exists(), "tests/test_date_range.py is missing")
        self.assertTrue(_user_tests_pass(SOURCE), "your tests fail on the real date_range.py")

    def test_hidden_tests_catch_every_mutant(self):
        self.assertTrue(USER_TESTS.exists(), "tests/test_date_range.py is missing")
        survived = []
        for name, (old, new) in MUTANTS.items():
            self.assertIn(old, SOURCE, f"mutant setup failed: {name}")
            if _user_tests_pass(SOURCE.replace(old, new, 1)):
                survived.append(name)
        self.assertEqual(survived, [], f"your tests did not catch: {', '.join(survived)}")


if __name__ == "__main__":
    unittest.main()
