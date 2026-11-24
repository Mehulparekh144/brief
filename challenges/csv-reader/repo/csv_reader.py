def parse_csv(text: str) -> list:
    """Parse CSV text. The first row is the header; each other row becomes a dict."""
    lines = text.split("\n")
    header = lines[0].split(",")
    return [dict(zip(header, line.split(","))) for line in lines[1:]]
