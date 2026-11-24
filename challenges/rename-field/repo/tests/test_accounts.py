import io
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from accounts.cli import main  # noqa: E402
from accounts.models import User  # noqa: E402
from accounts.report import summary  # noqa: E402
from accounts.store import dump_users, find_user, load_users  # noqa: E402

DATA = '[{"user_name": "kim", "email": "kim@example.com"}, {"user_name": "ana", "email": "ana@example.com", "active": false}]'


class AccountsTest(unittest.TestCase):
    def test_round_trip(self):
        users = load_users(DATA)
        self.assertEqual(users[0], User(user_name="kim", email="kim@example.com"))
        self.assertEqual(json.loads(dump_users(users))[1], {"user_name": "ana", "email": "ana@example.com", "active": False})

    def test_summary_and_find(self):
        users = [User(user_name="kim", email="kim@example.com"), User(user_name="bo", email="bo@example.com")]
        self.assertEqual(summary(users), "bo <bo@example.com>\nkim <kim@example.com>")
        self.assertEqual(find_user(users, "bo").email, "bo@example.com")

    def test_cli_export(self):
        out = io.StringIO()
        main(["export"], io.StringIO(DATA), out)
        self.assertEqual(json.loads(out.getvalue())[0]["user_name"], "kim")


if __name__ == "__main__":
    unittest.main()
