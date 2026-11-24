# filters

Splits filter expressions for the search page into tokens, for example `price >= 10 and name != "Bob Lee"`.

```python
from tokenizer import tokenize

tokenize('price >= 9.5')  # ['price', '>=', '9.5']
```

`python3 cli.py < filters.txt` prints the tokens of each line.

Run the tests with `python3 -m unittest discover -s tests -v`.
