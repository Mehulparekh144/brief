parse_duration() turns text like "1h30m" into seconds. It has almost no tests. Write them in our team's table-test format.

Format (this is how every test file in our codebase looks):
- File: tests/test_duration.py, with unittest (there is no pytest here). Start it like tests/test_smoke.py.
- A list CASES of (text, seconds) pairs, and a list ERRORS of texts that must raise ValueError.
- One test that loops over CASES and one that loops over ERRORS, each with self.subTest.

Cover:
- each unit alone (h, m, s), combinations like "1h30m", spaces and upper case, and zero
- errors: empty text, an unknown unit ("5d"), units out of order ("30m1h"), a repeated unit ("1h2h"), text after the last unit ("10m5")

Do not change duration.py.

Done when: your tests pass on the real code, follow the format, and a hidden check confirms they fail on 7 broken versions of the parser.
Check: python3 -m unittest discover -s tests -v
