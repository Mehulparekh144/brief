parse_duration() turns text like "1h30m" into seconds. It has almost no tests. Write them.

- Put the tests in tests/test_duration.py and use unittest (there is no pytest here).
- Cover each unit (h, m, s), combinations like "1h30m", spaces and upper case, and zero.
- These must raise ValueError: empty text, an unknown unit ("5d"), units out of order ("30m1h"), a repeated unit ("1h2h") and text after the last unit ("10m5").
- Do not change duration.py.

Done when: your tests pass on the real code, and a hidden check confirms they fail on 7 broken versions of it.
Check: python3 -m unittest discover -s tests -v
