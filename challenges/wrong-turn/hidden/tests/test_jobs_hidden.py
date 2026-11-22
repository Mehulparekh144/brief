import hashlib
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from mailer.batch import build_batch  # noqa: E402
from mailer.jobs import run_daily  # noqa: E402
from mailer.smtp import FakeSMTP  # noqa: E402

TEAMS = {
    "design": [{"email": "ana@example.com", "active": True}],
    "backend": [{"email": "kim@example.com", "active": True}, {"email": "lee@example.com", "active": True}],
    "support": [{"email": "ravi@example.com", "active": True}, {"email": "old@example.com", "active": False}],
}


class JobsHiddenTest(unittest.TestCase):
    def test_hidden_each_user_gets_one_email(self):
        smtp = FakeSMTP()
        run_daily(TEAMS, smtp)
        self.assertEqual(sorted(smtp.sent), ["ana@example.com", "kim@example.com", "lee@example.com", "ravi@example.com"])

    def test_hidden_two_runs_do_not_leak(self):
        first, second = FakeSMTP(), FakeSMTP()
        run_daily(TEAMS, first)
        run_daily(TEAMS, second)
        self.assertEqual(len(second.sent), 4)

    def test_hidden_build_batch_is_fresh_each_call(self):
        self.assertEqual(build_batch([{"email": "a@x.com", "active": True}]), ["a@x.com"])
        self.assertEqual(build_batch([{"email": "b@x.com", "active": True}]), ["b@x.com"])

    def test_hidden_retry_logic_unchanged(self):
        digest = hashlib.sha256((ROOT / "mailer" / "smtp.py").read_bytes()).hexdigest()
        self.assertEqual(digest, "3e765feff68a98017c0015da3010c5cf326399e5cad4cf3eda7d6ab385e8c05e", "mailer/smtp.py was changed")


if __name__ == "__main__":
    unittest.main()
