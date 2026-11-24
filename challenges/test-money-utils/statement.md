money.py has almost no tests. Write them in our team's format.

Format:
- File: tests/test_money.py, with unittest (there is no pytest here). Start it like tests/test_smoke.py.
- One TestCase class per function: AddTest for add(), SplitTest for split(), FormatTest for format_usd().
- A hidden check runs each class on its own, so each class must test its own function.

Cover:
- add: two amounts, more than two amounts, rounding half up to cents ("0.125" → 0.13), a float raises TypeError.
- split: split("10.00", 3) is [3.34, 3.33, 3.33]. The parts add up to the total. The extra cents go to the first parts.
- format_usd: thousands separators ("$1,234.50") and negative amounts ("-$5.00").

Do not change money.py.

A hidden check runs each class against 7 broken versions of money.py. Each class must catch the broken versions of its function.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
