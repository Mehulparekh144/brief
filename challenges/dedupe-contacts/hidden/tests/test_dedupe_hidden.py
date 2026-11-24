import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from contacts.dedupe import dedupe  # noqa: E402
from contacts.emails import normalize_email  # noqa: E402
from contacts.importer import import_contacts  # noqa: E402


def c(name, email, *phones):
    return {"name": name, "email": email, "phones": list(phones)}


class DedupeHiddenTest(unittest.TestCase):
    def test_hidden_normalize_email(self):
        self.assertEqual(normalize_email("  Ana.Lee+News@GMail.com "), "analee@gmail.com")
        self.assertEqual(normalize_email("a.n.a+x+y@googlemail.com"), "ana@gmail.com")
        self.assertEqual(normalize_email("Bo.Smith+work@Example.com"), "bo.smith+work@example.com")

    def test_hidden_gmail_variants_merge(self):
        out = dedupe([c("Ana", "Ana.Lee+news@gmail.com"), c("Ana L", "analee@googlemail.com")])
        self.assertEqual(out, [c("Ana", "analee@gmail.com")])

    def test_hidden_other_domains_keep_dots_and_tags(self):
        out = dedupe([c("Bo", "bo+work@example.com"), c("Bo", "bo@example.com"), c("Bo", "b.o@example.com")])
        self.assertEqual([x["email"] for x in out], ["bo+work@example.com", "bo@example.com", "b.o@example.com"])

    def test_hidden_order_of_first_appearance(self):
        out = dedupe([c("Kim", "kim@example.com"), c("Ana", "ana@gmail.com"), c("Kim", "KIM@example.com"), c("Lee", "lee@example.com"), c("Ana", "a.na@gmail.com")])
        self.assertEqual([x["name"] for x in out], ["Kim", "Ana", "Lee"])

    def test_hidden_first_non_empty_name(self):
        out = dedupe([c("", "kim@example.com"), c("Kim Park", "kim@example.com"), c("K. Park", "kim@example.com")])
        self.assertEqual(out[0]["name"], "Kim Park")

    def test_hidden_phones_merged_by_digits(self):
        out = dedupe([
            c("Ana", "ana@example.com", "617-555-0101", "617-555-0101"),
            c("Ana", "ana@example.com", "(617) 555 0101", "617.555.0199"),
            c("Ana", "ana@example.com", "6175550199", "+1 617 555 0101"),
        ])
        self.assertEqual(out[0]["phones"], ["617-555-0101", "617.555.0199", "+1 617 555 0101"])

    def test_hidden_empty_email_never_merged(self):
        out = dedupe([c("Kim", "", "1"), c("Lee", " ", "2"), c("Kim", "kim@example.com")])
        self.assertEqual([x["name"] for x in out], ["Kim", "Lee", "Kim"])
        self.assertEqual(out[1]["phones"], ["2"])

    def test_hidden_input_not_changed(self):
        contacts = [c("Ana", "Ana@Gmail.com", "1"), c("Ana", "ana@gmail.com", "2")]
        before = copy.deepcopy(contacts)
        dedupe(contacts)
        self.assertEqual(contacts, before)
        csv_text = "name,email,phones\nAna,Ana.Lee@gmail.com,617-555-0101\n,analee+x@googlemail.com,(617) 555-0101;617-555-0102\n"
        self.assertEqual(import_contacts(csv_text), [c("Ana", "analee@gmail.com", "617-555-0101", "617-555-0102")])


if __name__ == "__main__":
    unittest.main()
