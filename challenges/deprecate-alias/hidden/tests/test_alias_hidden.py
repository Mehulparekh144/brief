import datetime as dt
import sys
import unittest
import warnings
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import dates  # noqa: E402
from dates import billing, parsing, reports  # noqa: E402

MESSAGE = "parse_date() is deprecated; use parse_iso_date()"


class AliasHiddenTest(unittest.TestCase):
    def test_hidden_new_name(self):
        self.assertEqual(parsing.parse_iso_date(" 2026-03-01 "), dt.date(2026, 3, 1))
        with self.assertRaises(ValueError) as ctx:
            parsing.parse_iso_date("2026/03/01")
        self.assertEqual(str(ctx.exception), "not an ISO date: '2026/03/01'")

    def test_hidden_new_name_does_not_warn(self):
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            parsing.parse_iso_date("2026-03-01")
        self.assertEqual(caught, [])

    def test_hidden_old_name_warns(self):
        with self.assertWarns(DeprecationWarning) as cm:
            result = parsing.parse_date("2026-12-31")
        self.assertEqual(result, dt.date(2026, 12, 31))
        self.assertEqual(str(cm.warning), MESSAGE)

    def test_hidden_warning_points_at_caller(self):
        with self.assertWarns(DeprecationWarning) as cm:
            parsing.parse_date("2026-12-31")
        self.assertEqual(Path(cm.filename).resolve(), Path(__file__).resolve(), "use stacklevel=2")

    def test_hidden_old_name_same_errors(self):
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            with self.assertRaises(ValueError) as ctx:
                parsing.parse_date("soon")
        self.assertEqual(str(ctx.exception), "not an ISO date: 'soon'")

    def test_hidden_package_exports_both(self):
        self.assertIs(dates.parse_iso_date, parsing.parse_iso_date)
        self.assertIs(dates.parse_date, parsing.parse_date)

    def test_hidden_internal_callers_use_new_name(self):
        for module in (billing, reports):
            self.assertNotIn("parse_date", Path(module.__file__).read_text(), f"{module.__name__} still uses parse_date")
        with warnings.catch_warnings():
            warnings.simplefilter("error")
            self.assertEqual(billing.due_date({"issued": "2026-01-01"}), dt.date(2026, 1, 31))
            self.assertFalse(billing.is_overdue({"issued": "2026-01-01", "paid": True}, "2026-06-01"))
            self.assertEqual(reports.first_and_last([{"date": "2026-05-02"}, {"date": "2026-04-30"}]), (dt.date(2026, 4, 30), dt.date(2026, 5, 2)))


if __name__ == "__main__":
    unittest.main()
