import csv
import io


def parse_csv(text: str) -> list:
    """Parse CSV text. The first row is the header; each other row becomes a dict."""
    rows = list(csv.reader(io.StringIO(text, newline="")))
    if not rows:
        return []
    header, *body = rows
    out = []
    for number, row in enumerate(body, start=2):
        if len(row) > len(header):
            raise ValueError(f"row {number} has {len(row)} fields, the header has {len(header)}")
        out.append(dict(zip(header, row + [""] * (len(header) - len(row)))))
    return out
