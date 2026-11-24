import sys
import unittest
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from cron import next_run  # noqa: E402


class CronTest(unittest.TestCase):
    def test_daily_job(self):
        self.assertEqual(next_run("30 9 * * *", datetime(2026, 3, 1, 8, 0)), datetime(2026, 3, 1, 9, 30))

    def test_hourly_job(self):
        self.assertEqual(next_run("0 * * * *", datetime(2026, 3, 1, 8, 20)), datetime(2026, 3, 1, 9, 0))


if __name__ == "__main__":
    unittest.main()
