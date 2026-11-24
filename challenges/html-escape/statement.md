Security report: the search page has an XSS hole.

    GET /search?q=" autofocus onfocus="alert(document.cookie)

The page puts the query inside `value="..."`, and the browser runs the script.

The same audit found more problems in the template engine (src/template):
- `{{{key}}}` inserts raw HTML for every key, even comment text from users.
- A missing key renders as the text "undefined".

Rules for render(template, data, options):
- `{{key}}` inserts the value, escaped: & < > " ' become &amp; &lt; &gt; &quot; &#39;.
- `{{{key}}}` inserts the value raw only when key is in `options.allowRaw`. Otherwise it is escaped like `{{key}}`.
- A missing value (undefined or null) renders as "". Other values use String(value), so 0 renders as "0".
- Each value is inserted once. If a value contains `{{name}}`, it stays as plain text.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
