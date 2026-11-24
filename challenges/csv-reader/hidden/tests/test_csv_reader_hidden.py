import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from csv_reader import parse_csv  # noqa: E402


class CsvReaderHiddenTest(unittest.TestCase):
    def test_hidden_quoted_comma(self):
        self.assertEqual(parse_csv('name,city\n"Smith, Ann",Boston\n'), [{"name": "Smith, Ann", "city": "Boston"}])

    def test_hidden_doubled_quotes(self):
        self.assertEqual(
            parse_csv('name,quote\nAnn,"say ""hi"""\nBob,""\n'),
            [{"name": "Ann", "quote": 'say "hi"'}, {"name": "Bob", "quote": ""}],
        )

    def test_hidden_newline_inside_quotes(self):
        self.assertEqual(
            parse_csv('name,note\nAnn,"line 1\nline 2"\nBob,x\n'),
            [{"name": "Ann", "note": "line 1\nline 2"}, {"name": "Bob", "note": "x"}],
        )

    def test_hidden_crlf(self):
        self.assertEqual(
            parse_csv("name,city\r\nAnn,Boston\r\nBob,Austin\r\n"),
            [{"name": "Ann", "city": "Boston"}, {"name": "Bob", "city": "Austin"}],
        )

    def test_hidden_trailing_newline_adds_no_row(self):
        self.assertEqual(parse_csv("name\nAnn\n"), [{"name": "Ann"}])
        self.assertEqual(parse_csv("name\n"), [])
        self.assertEqual(parse_csv(""), [])

    def test_hidden_missing_fields_are_empty(self):
        self.assertEqual(
            parse_csv("a,b,c\n1\n1,2\n"),
            [{"a": "1", "b": "", "c": ""}, {"a": "1", "b": "2", "c": ""}],
        )

    def test_hidden_extra_fields_raise(self):
        with self.assertRaises(ValueError):
            parse_csv("a,b\n1,2,3\n")
        with self.assertRaises(ValueError):
            parse_csv('a,b\n1,"x,y",z\n')

    def test_hidden_crm_export(self):
        text = 'name,email,notes\r\n"Diaz, Bob",bob@example.com,"Prefers ""Bob""\ncall after 3pm"\r\nCara Yu,cara@example.com\r\n'
        self.assertEqual(
            parse_csv(text),
            [
                {"name": "Diaz, Bob", "email": "bob@example.com", "notes": 'Prefers "Bob"\ncall after 3pm'},
                {"name": "Cara Yu", "email": "cara@example.com", "notes": ""},
            ],
        )


if __name__ == "__main__":
    unittest.main()
