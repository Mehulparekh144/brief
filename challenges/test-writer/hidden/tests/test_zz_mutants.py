"""Hidden check: the user's tests must catch each broken version of duration.py."""
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = (ROOT / "duration.py").read_text()
MUTANTS = {
    "hours worth 360 s": ('"h": 3600', '"h": 360'),
    "no lower-casing": ('.replace(" ", "").lower()', '.replace(" ", "")'),
    "spaces not removed": ('text.replace(" ", "").lower()', "text.lower()"),
    "empty text allowed": ('    if not s:\n        raise ValueError("empty duration")\n', ""),
    "repeated unit allowed": ("if order <= last:", "if order < last:"),
    "trailing text allowed": ('    if pos != len(s):\n        raise ValueError(f"bad duration: {text!r}")\n', ""),
    "seconds ignored": ('"s": 1}', '"s": 0}'),
}


class MutantTest(unittest.TestCase):
    def test_hidden_tests_file_exists(self):
        self.assertTrue((ROOT / "tests" / "test_duration.py").exists(), "tests/test_duration.py is missing")

    def test_hidden_duration_unchanged(self):
        self.assertIn('"h": 3600', SOURCE)
        self.assertIn("if order <= last:", SOURCE)

    def test_hidden_tests_catch_every_mutant(self):
        user_tests = ROOT / "tests" / "test_duration.py"
        self.assertTrue(user_tests.exists())
        survived = []
        for name, (old, new) in MUTANTS.items():
            self.assertIn(old, SOURCE, f"mutant setup failed: {name}")
            with tempfile.TemporaryDirectory() as tmp:
                (Path(tmp) / "tests").mkdir()
                (Path(tmp) / "duration.py").write_text(SOURCE.replace(old, new, 1))
                shutil.copy(user_tests, Path(tmp) / "tests" / "test_duration.py")
                r = subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests"], cwd=tmp, capture_output=True, timeout=60)
                if r.returncode == 0:
                    survived.append(name)
        self.assertEqual(survived, [], f"your tests did not catch: {', '.join(survived)}")


if __name__ == "__main__":
    unittest.main()
