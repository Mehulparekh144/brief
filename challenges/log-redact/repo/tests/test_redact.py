import io
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from logkit.logger import JsonLogger  # noqa: E402
from logkit.redact import redact  # noqa: E402


class RedactTest(unittest.TestCase):
    def test_password(self):
        self.assertEqual(redact({"user": "kim", "password": "hunter2"}), {"user": "kim", "password": "***"})

    def test_logger_writes_redacted_json(self):
        out = io.StringIO()
        JsonLogger(out, clock=lambda: 1.0).info("login", password="hunter2")
        self.assertEqual(json.loads(out.getvalue()), {"ts": 1.0, "level": "info", "message": "login", "password": "***"})


if __name__ == "__main__":
    unittest.main()
