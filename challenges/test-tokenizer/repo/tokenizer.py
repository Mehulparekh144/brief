import re

_TOKEN = re.compile(
    r"""
    (?P<space>\s+)
    |(?P<number>\d+(?:\.\d+)?)
    |(?P<name>[A-Za-z_][A-Za-z0-9_]*)
    |(?P<string>"[^"]*")
    |(?P<op><=|>=|==|!=|[-+*/()<>=])
    """,
    re.VERBOSE,
)


def tokenize(text):
    """'price >= 10' -> ['price', '>=', '10']. Raises ValueError on a character it does not know."""
    tokens, pos = [], 0
    while pos < len(text):
        m = _TOKEN.match(text, pos)
        if not m:
            raise ValueError(f"unexpected {text[pos]!r} at position {pos}")
        if m.lastgroup != "space":
            tokens.append(m.group())
        pos = m.end()
    return tokens
