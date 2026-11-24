import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from csv_reader import parse_csv  # noqa: E402


class CsvReaderTest(unittest.TestCase):
    def test_simple_rows(self):
        self.assertEqual(
            parse_csv("name,city\nAnn,Boston\nBob,Austin"),
            [{"name": "Ann", "city": "Boston"}, {"name": "Bob", "city": "Austin"}],
        )

    def test_header_keys(self):
        self.assertEqual(list(parse_csv("id,name,email\n1,Ann,a@x.com")[0]), ["id", "name", "email"])


if __name__ == "__main__":
    unittest.main()
