import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from mdlite import render  # noqa: E402


class RenderTest(unittest.TestCase):
    def test_paragraph(self):
        self.assertEqual(render("Hello there"), "<p>Hello there</p>")

    def test_heading(self):
        self.assertEqual(render("# Hi"), "<h1>Hi</h1>")


if __name__ == "__main__":
    unittest.main()
