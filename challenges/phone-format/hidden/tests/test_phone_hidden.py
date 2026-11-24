import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from phone import to_e164  # noqa: E402


class PhoneHiddenTest(unittest.TestCase):
    def assertInvalid(self, raw, country="US"):
        with self.assertRaises(ValueError, msg=repr(raw)):
            to_e164(raw, country)

    def test_hidden_spaces_and_punctuation(self):
        self.assertEqual(to_e164(" 617 555 0142 "), "+16175550142")
        self.assertEqual(to_e164("(617)555.0142"), "+16175550142")

    def test_hidden_us_leading_one(self):
        self.assertEqual(to_e164("1 617 555 0142"), "+16175550142")
        self.assertEqual(to_e164("1-617-555-0142"), "+16175550142")

    def test_hidden_plus_kept(self):
        self.assertEqual(to_e164("+44 20 7946 0958"), "+442079460958")
        self.assertEqual(to_e164("+1 (617) 555-0142"), "+16175550142")

    def test_hidden_double_zero_means_plus(self):
        self.assertEqual(to_e164("0044 20 7946 0958"), "+442079460958")
        self.assertEqual(to_e164("00 49 30 901820"), "+4930901820")
        self.assertEqual(to_e164("001-617-555-0142"), "+16175550142")

    def test_hidden_plus_length(self):
        self.assertEqual(to_e164("+12345678"), "+12345678")
        self.assertEqual(to_e164("+123456789012345"), "+123456789012345")
        self.assertInvalid("+1234567")
        self.assertInvalid("+1234567890123456")
        self.assertInvalid("001234567890123456")

    def test_hidden_us_wrong_length(self):
        self.assertInvalid("555-0142")
        self.assertInvalid("2-617-555-0142")
        self.assertInvalid("617-555-01429")
        self.assertInvalid("")

    def test_hidden_bad_characters(self):
        self.assertInvalid("617-555-CALL")
        self.assertInvalid("617-555-0142 ext 5")
        self.assertInvalid("617+555+0142")
        self.assertInvalid("#617-555-0142")
        self.assertInvalid("617/555/0142")

    def test_hidden_only_us_default(self):
        self.assertInvalid("020 7946 0958", "GB")
        self.assertInvalid("617 555 0142", "CA")
        self.assertEqual(to_e164("+44 20 7946 0958", "GB"), "+442079460958")


if __name__ == "__main__":
    unittest.main()
