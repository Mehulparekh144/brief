import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from mailer.jobs import run_daily  # noqa: E402
from mailer.smtp import FakeSMTP  # noqa: E402


class JobsTest(unittest.TestCase):
    def test_one_team(self):
        smtp = FakeSMTP()
        run_daily({"design": [{"email": "ana@example.com", "active": True}, {"email": "bo@example.com", "active": False}]}, smtp)
        self.assertEqual(smtp.sent, ["ana@example.com"])

    def test_retry_after_timeout(self):
        smtp = FakeSMTP(fail_first=1)
        self.assertTrue(smtp.send("kim@example.com"))
        self.assertEqual(smtp.sent, ["kim@example.com"])


if __name__ == "__main__":
    unittest.main()
