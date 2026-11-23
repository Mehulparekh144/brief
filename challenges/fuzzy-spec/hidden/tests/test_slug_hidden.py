import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from slug import slugify  # noqa: E402


class SlugHiddenTest(unittest.TestCase):
    def test_accents(self):
        self.assertEqual(slugify("Café au Lait"), "cafe-au-lait")
        self.assertEqual(slugify("Ünïcödé Ñame"), "unicode-name")

    def test_punctuation_runs(self):
        self.assertEqual(slugify("  Hello,   World!!  "), "hello-world")
        self.assertEqual(slugify("C++ & Rust: a love story"), "c-rust-a-love-story")

    def test_no_edge_hyphens(self):
        self.assertEqual(slugify("---Already--Slugged---"), "already-slugged")

    def test_whole_words_up_to_50(self):
        title = "The quick brown fox jumps over the lazy dog and keeps running far away"
        self.assertEqual(slugify(title), "the-quick-brown-fox-jumps-over-the-lazy-dog-and")

    def test_one_long_word_is_cut(self):
        self.assertEqual(slugify("a" * 60), "a" * 50)

    def test_empty_becomes_post(self):
        self.assertEqual(slugify("!!!"), "post")
        self.assertEqual(slugify(""), "post")


if __name__ == "__main__":
    unittest.main()
