User comments go through `render(md)` in `mdlite.py`. It does not escape HTML, so a comment with `<script>` runs in every reader's browser. Rewrite it with these rules:

1. Escape the HTML first, with `html.escape` (quotes too). Then do the rest. An `&amp;` in the input becomes `&amp;amp;`.
2. Work line by line. Strip the spaces at both ends of each line.
3. A line that starts with `# `, `## ` or `### ` is a heading by itself: `<h1>`, `<h2>`, `<h3>`. Strip the heading text.
4. `#### x` and `#x` are not headings. They are normal text.
5. Other lines make paragraphs: `<p>…</p>`. A blank line (or only spaces) ends a paragraph.
6. Join the lines of one paragraph with one space.
7. Join the blocks with `\n`. No newline at the end. Empty input gives `""`.
8. In headings and paragraphs: `**x**` → `<strong>x</strong>`, `*x*` → `<em>x</em>`.
9. `[text](url)` → `<a href="url">text</a>` only when the url starts with `http://` or `https://` (any case). Otherwise output only the text. A url has no spaces.

Example: `# Hi\nA *b*\nc` → `<h1>Hi</h1>\n<p>A <em>b</em> c</p>`.

Keep the signature. Do not change `comments.py`.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
