"""Hidden check: each test class must catch the broken versions of its function in money.py."""
import hashlib
import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
USER_TESTS = ROOT / "tests" / "test_money.py"
SOURCE = (ROOT / "money.py").read_text()
MUTANTS = {
    "AddTest": {
        "rounds half even": ("rounding=ROUND_HALF_UP)", 'rounding="ROUND_HALF_EVEN")'),
        "floats accepted": ('    if isinstance(value, float):\n        raise TypeError("use str or Decimal for money, not float")\n', ""),
        "only the first two amounts": ("for amount in amounts:", "for amount in amounts[:2]:"),
    },
    "SplitTest": {
        "remainder dropped": ("Decimal(base + (1 if i < extra else 0))", "Decimal(base)"),
        "extra cents last": ("1 if i < extra else 0", "1 if i >= parts - extra else 0"),
    },
    "FormatTest": {
        "no thousands separator": (":,.2f}", ":.2f}"),
        "minus after the dollar sign": ('f"{sign}${abs(value):,.2f}"', 'f"${sign}{abs(value):,.2f}"'),
    },
}


def _user_module():
    spec = importlib.util.spec_from_file_location("user_money_tests", USER_TESTS)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class MoneyMutantTest(unittest.TestCase):
    def _survivors(self, cls_name):
        self.assertTrue(USER_TESTS.exists(), "tests/test_money.py is missing")
        survived = []
        for name, (old, new) in MUTANTS[cls_name].items():
            self.assertIn(old, SOURCE, f"mutant setup failed: {name}")
            with tempfile.TemporaryDirectory() as tmp:
                (Path(tmp) / "tests").mkdir()
                (Path(tmp) / "money.py").write_text(SOURCE.replace(old, new, 1))
                shutil.copy(USER_TESTS, Path(tmp) / "tests" / "test_money.py")
                r = subprocess.run([sys.executable, "-m", "unittest", f"tests.test_money.{cls_name}"],
                                   cwd=tmp, capture_output=True, timeout=60)
                if r.returncode == 0:
                    survived.append(name)
        return survived

    def test_hidden_tests_file_exists(self):
        self.assertTrue(USER_TESTS.exists(), "tests/test_money.py is missing")

    def test_hidden_one_class_per_function(self):
        mod = _user_module()
        for cls_name in MUTANTS:
            cls = getattr(mod, cls_name, None)
            self.assertTrue(isinstance(cls, type) and issubclass(cls, unittest.TestCase), f"define class {cls_name}(unittest.TestCase)")
            self.assertTrue([m for m in dir(cls) if m.startswith("test")], f"{cls_name} has no test methods")

    def test_hidden_money_unchanged(self):
        digest = hashlib.sha256((ROOT / "money.py").read_bytes()).hexdigest()
        self.assertEqual(digest, "cf897b2dc958a6bebd1f2bd0ea8d9e5f850b55315fe9c38048dc39baa373a898", "money.py was changed")

    def test_hidden_add_tests_catch_mutants(self):
        self.assertEqual(self._survivors("AddTest"), [], "AddTest did not catch these broken versions of add")

    def test_hidden_split_tests_catch_mutants(self):
        self.assertEqual(self._survivors("SplitTest"), [], "SplitTest did not catch these broken versions of split")

    def test_hidden_format_tests_catch_mutants(self):
        self.assertEqual(self._survivors("FormatTest"), [], "FormatTest did not catch these broken versions of format_usd")


if __name__ == "__main__":
    unittest.main()
