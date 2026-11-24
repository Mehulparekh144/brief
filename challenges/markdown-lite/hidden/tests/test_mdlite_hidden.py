import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from mdlite import render  # noqa: E402


class RenderHiddenTest(unittest.TestCase):
    def test_hidden_script_is_escaped(self):
        self.assertEqual(render("<script>alert(1)</script>"), "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>")
        self.assertEqual(render('# <img src=x onerror="alert(1)">'), "<h1>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</h1>")
        self.assertEqual(render("**<b>hi</b>**"), "<p><strong>&lt;b&gt;hi&lt;/b&gt;</strong></p>")

    def test_hidden_quotes_and_ampersands_are_escaped(self):
        self.assertEqual(render("Tom & Jerry's \"show\""), "<p>Tom &amp; Jerry&#x27;s &quot;show&quot;</p>")
        self.assertEqual(render("AT&amp;T"), "<p>AT&amp;amp;T</p>")

    def test_hidden_headings(self):
        self.assertEqual(render("# A"), "<h1>A</h1>")
        self.assertEqual(render("## B"), "<h2>B</h2>")
        self.assertEqual(render("### C"), "<h3>C</h3>")
        self.assertEqual(render("#### D"), "<p>#### D</p>")
        self.assertEqual(render("#E"), "<p>#E</p>")
        self.assertEqual(render("  #   Spaced   "), "<h1>Spaced</h1>")

    def test_hidden_bold_and_em(self):
        self.assertEqual(render("**bold** and *em*"), "<p><strong>bold</strong> and <em>em</em></p>")
        self.assertEqual(render("## **Big** *idea*"), "<h2><strong>Big</strong> <em>idea</em></h2>")

    def test_hidden_http_links(self):
        self.assertEqual(render("[site](https://example.com/a?b=1&c=2)"), '<p><a href="https://example.com/a?b=1&amp;c=2">site</a></p>')
        self.assertEqual(render("See [docs](http://docs.example.com)."), '<p>See <a href="http://docs.example.com">docs</a>.</p>')
        self.assertEqual(render("[x](HTTPS://EXAMPLE.COM)"), '<p><a href="HTTPS://EXAMPLE.COM">x</a></p>')
        self.assertEqual(render("[<i>x</i>](https://a.example)"), '<p><a href="https://a.example">&lt;i&gt;x&lt;/i&gt;</a></p>')

    def test_hidden_other_links_become_text(self):
        for url in ["javascript:void0", "JaVaScRiPt:void0", "data:text/html;base64,PHNjcmlwdD4=", "vbscript:msgbox",
                    "//evil.example", "/admin", "mailto:a@b.example", "ftp://files.example", "http:evil.example"]:
            with self.subTest(url=url):
                self.assertEqual(render(f"[click]({url})"), "<p>click</p>")
        out = render("[x](javascript:alert(1))")
        self.assertNotIn("<a", out)
        self.assertNotIn("href", out)

    def test_hidden_no_attribute_breakout(self):
        out = render('[a](https://x.example"onmouseover="alert(1))')
        self.assertNotIn('"onmouseover', out)
        self.assertIn('href="https://x.example&quot;onmouseover=&quot;alert(1', out)

    def test_hidden_paragraphs_and_blocks(self):
        self.assertEqual(render("One\ntwo\n\n\nThree"), "<p>One two</p>\n<p>Three</p>")
        self.assertEqual(render("# Title\nBody line\n## Next"), "<h1>Title</h1>\n<p>Body line</p>\n<h2>Next</h2>")
        self.assertEqual(render("A\n   \nB"), "<p>A</p>\n<p>B</p>")
        self.assertEqual(render("   indented   \n"), "<p>indented</p>")
        self.assertEqual(render(""), "")
        self.assertEqual(render("\n\n  \n"), "")


if __name__ == "__main__":
    unittest.main()
