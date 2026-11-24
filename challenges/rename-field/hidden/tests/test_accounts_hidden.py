import dataclasses
import io
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from accounts.cli import main  # noqa: E402
from accounts.models import User  # noqa: E402
from accounts.report import inactive_names, summary  # noqa: E402
from accounts.store import dump_users, find_user, load_users  # noqa: E402


class RenameHiddenTest(unittest.TestCase):
    def test_hidden_user_field_renamed(self):
        self.assertEqual([f.name for f in dataclasses.fields(User)], ["username", "email", "active"])
        users = [User(username="kim", email="kim@example.com"), User(username="bo", email="bo@example.com", active=False)]
        self.assertEqual(summary(users), "kim <kim@example.com>")
        self.assertEqual(inactive_names(users), ["bo"])

    def test_hidden_dump_writes_new_key(self):
        out = json.loads(dump_users([User(username="ana", email="ana@example.com")]))
        self.assertEqual(out, [{"username": "ana", "email": "ana@example.com", "active": True}])

    def test_hidden_old_key_still_loads(self):
        users = load_users('[{"user_name": "bo", "email": "bo@example.com", "active": false}]')
        self.assertEqual(users, [User(username="bo", email="bo@example.com", active=False)])

    def test_hidden_new_key_wins(self):
        users = load_users('[{"user_name": "old", "username": "new", "email": "n@example.com"}]')
        self.assertEqual(users[0].username, "new")

    def test_hidden_missing_name_message(self):
        with self.assertRaises(ValueError) as ctx:
            load_users('[{"email": "x@example.com"}]')
        self.assertEqual(str(ctx.exception), "username is required")

    def test_hidden_find_user_parameter(self):
        users = load_users('[{"username": "ana", "email": "ana@example.com"}]')
        self.assertEqual(find_user(users, username="ana").email, "ana@example.com")
        out = io.StringIO()
        main(["export"], io.StringIO('[{"user_name": "kim", "email": "kim@example.com"}]'), out)
        self.assertEqual(json.loads(out.getvalue()), [{"username": "kim", "email": "kim@example.com", "active": True}])

    def test_hidden_old_name_only_in_loader(self):
        for path in sorted((ROOT / "accounts").glob("*.py")):
            if path.name != "store.py":
                self.assertNotIn("user_name", path.read_text(), f"accounts/{path.name} still uses user_name")
        readme = (ROOT / "README.md").read_text()
        self.assertNotIn("user_name", readme, "README.md still shows user_name")
        self.assertIn('"username"', readme)


if __name__ == "__main__":
    unittest.main()
