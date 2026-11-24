tokenize() splits a search filter like `price >= 10 and name != "Bob Lee"` into tokens. It has almost no tests. Write them in our team's table-test format.

Format (every test file in our codebase looks like this):
- File: tests/test_tokenizer.py, with unittest (there is no pytest here). Start it like tests/test_smoke.py.
- A list `CASES` of `(text, tokens)` pairs. `tokens` is the list that tokenize() returns.
- One test method that loops over CASES with `self.subTest` and `assertEqual`.

Cover:
- integers and decimals ("3.14")
- names with digits and underscores ("rate_2", "_x")
- each two-character operator as one token: `<=`, `>=`, `==`, `!=`
- one-character operators and parentheses: `+ - * / ( ) < > =`
- spaces are skipped, and text with no spaces works too ("a+b")
- strings in double quotes with a space inside (`"Bob Lee"`); the token keeps its quotes
- empty text gives []

Do not change tokenizer.py.

Done when: your tests pass on the real code, follow the format, and a hidden check confirms they fail on 7 broken versions of the tokenizer.
Check: python3 -m unittest discover -s tests -v
