import copy
import io
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from logkit.http import log_request  # noqa: E402
from logkit.logger import JsonLogger  # noqa: E402
from logkit.redact import redact  # noqa: E402


class RedactHiddenTest(unittest.TestCase):
    def test_hidden_nested_dicts_and_lists(self):
        record = {"user": {"profile": {"api_key": "k-1"}}, "items": [{"token": "t-1"}, [{"secret": "s"}]]}
        self.assertEqual(redact(record), {"user": {"profile": {"api_key": "***"}}, "items": [{"token": "***"}, [{"secret": "***"}]]})

    def test_hidden_keys_are_case_insensitive_and_exact(self):
        record = {"Password": "a", "API_KEY": "b", "Token": "c", "password_hint": "pet name", "tokens": 3}
        self.assertEqual(redact(record), {"Password": "***", "API_KEY": "***", "Token": "***", "password_hint": "pet name", "tokens": 3})

    def test_hidden_any_value_type_is_masked(self):
        record = {"secret": {"a": 1}, "token": ["x", "y"], "password": 1234, "api_key": None}
        self.assertEqual(redact(record), {"secret": "***", "token": "***", "password": "***", "api_key": "***"})

    def test_hidden_emails(self):
        record = {"to": "ana.lee@example.com", "note": "cc Bo@Mail.Example.org, then stop.", "list": ["kim@x.io"]}
        self.assertEqual(redact(record), {"to": "a***@example.com", "note": "cc B***@Mail.Example.org, then stop.", "list": ["k***@x.io"]})

    def test_hidden_bearer_tokens(self):
        record = {"Authorization": "Bearer abc.DEF-123", "msg": "retry with bearer xyz== now"}
        self.assertEqual(redact(record), {"Authorization": "Bearer ***", "msg": "retry with bearer *** now"})

    def test_hidden_input_not_changed(self):
        record = {"password": "p", "nested": {"token": "t", "to": "ana@example.com"}, "list": [{"secret": "s"}]}
        before = copy.deepcopy(record)
        redact(record)
        self.assertEqual(record, before)

    def test_hidden_other_values_kept(self):
        record = {"count": 3, "ok": True, "ratio": 0.5, "none": None, "path": "/api/v1/users", "tags": ["a", 1]}
        self.assertEqual(redact(record), record)

    def test_hidden_request_log_line(self):
        out = io.StringIO()
        headers = {"Authorization": "Bearer s3cr3t", "X-Api-Key": "k"}
        log_request(JsonLogger(out, clock=lambda: 2.0), "POST", "/signup", headers, {"email": "ana@example.com", "Password": "pw"})
        line = json.loads(out.getvalue())
        self.assertEqual(line["headers"], {"Authorization": "Bearer ***", "X-Api-Key": "k"})
        self.assertEqual(line["body"], {"email": "a***@example.com", "Password": "***"})
        self.assertNotIn("s3cr3t", out.getvalue())


if __name__ == "__main__":
    unittest.main()
