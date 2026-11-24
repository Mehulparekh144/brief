import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from contacts.dedupe import dedupe  # noqa: E402
from contacts.importer import load_csv  # noqa: E402


class DedupeTest(unittest.TestCase):
    def test_same_email_is_one_contact(self):
        contacts = [
            {"name": "Kim", "email": "kim@example.com", "phones": ["617-555-0101"]},
            {"name": "Kim", "email": "kim@example.com", "phones": []},
        ]
        self.assertEqual(dedupe(contacts), [{"name": "Kim", "email": "kim@example.com", "phones": ["617-555-0101"]}])

    def test_load_csv(self):
        rows = load_csv("name,email,phones\nAna Lee, ana@example.com ,617-555-0101; 617-555-0102\n")
        self.assertEqual(rows, [{"name": "Ana Lee", "email": "ana@example.com", "phones": ["617-555-0101", "617-555-0102"]}])


if __name__ == "__main__":
    unittest.main()
