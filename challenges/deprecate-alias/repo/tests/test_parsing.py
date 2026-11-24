import datetime as dt
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from dates import parse_date  # noqa: E402
from dates.billing import due_date, is_overdue  # noqa: E402
from dates.reports import by_month  # noqa: E402


class ParsingTest(unittest.TestCase):
    def test_parse(self):
        self.assertEqual(parse_date(" 2026-03-01 "), dt.date(2026, 3, 1))
        with self.assertRaises(ValueError):
            parse_date("03/01/2026")

    def test_billing_and_reports(self):
        invoice = {"issued": "2026-01-15", "terms": 14}
        self.assertEqual(due_date(invoice), dt.date(2026, 1, 29))
        self.assertTrue(is_overdue(invoice, "2026-02-01"))
        rows = [{"date": "2026-02-03", "amount": 5}, {"date": "2026-01-09", "amount": 7}, {"date": "2026-02-20", "amount": 1}]
        self.assertEqual(by_month(rows), {"2026-01": 7, "2026-02": 6})


if __name__ == "__main__":
    unittest.main()
