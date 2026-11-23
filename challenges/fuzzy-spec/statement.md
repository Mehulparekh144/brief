slugify() turns a blog post title into a URL slug. Today it only lowercases and swaps spaces. Make it follow these rules:

1. Lowercase.
2. Accented letters become plain letters: "Café" → "cafe".
3. Any run of characters that are not a–z or 0–9 becomes one hyphen.
4. No hyphen at the start or the end.
5. At most 50 characters. Keep the longest run of whole words that fits. If the first word alone is longer than 50, cut it at 50.
6. If nothing is left, return "post".

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
