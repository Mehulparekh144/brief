import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from grades import letter  # noqa: E402

TABLE = [
    (100, "A"), (93, "A"), (92, "A-"), (90, "A-"), (89, "B+"), (87, "B+"), (86, "B"), (83, "B"),
    (82, "B-"), (80, "B-"), (79, "C+"), (77, "C+"), (76, "C"), (73, "C"), (72, "C-"), (70, "C-"),
    (69, "D"), (60, "D"), (59, "F"), (0, "F"),
]


class GradesHiddenTest(unittest.TestCase):
    def test_hidden_rounds_half_up(self):
        for score, grade in [(92.5, "A"), (86.5, "B+"), (82.5, "B"), (76.5, "C+"), (72.5, "C")]:
            self.assertEqual(letter(score), grade, score)

    def test_hidden_rounds_down_below_half(self):
        self.assertEqual(letter(92.49), "A-")
        self.assertEqual(letter(89.4), "B+")

    def test_hidden_89_5_is_a_minus(self):
        self.assertEqual(letter(89.5), "A-")

    def test_hidden_b_plus_starts_at_87(self):
        self.assertEqual(letter(87), "B+")
        self.assertEqual(letter(86), "B")

    def test_hidden_every_cutoff(self):
        for score, grade in TABLE:
            self.assertEqual(letter(score), grade, score)

    def test_hidden_out_of_range_raises(self):
        for score in (-1, -0.5, 100.5, 101):
            with self.assertRaises(ValueError):
                letter(score)


if __name__ == "__main__":
    unittest.main()
