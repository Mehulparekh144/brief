import re
from pathlib import Path

_COMMON_FILE = Path(__file__).resolve().parent / "data" / "common_passwords.txt"
_common = None


def _common_passwords() -> set:
    global _common
    if _common is None:
        lines = (line.strip() for line in _COMMON_FILE.read_text().splitlines())
        _common = {line.lower() for line in lines if line and not line.startswith("#")}
    return _common


def check(password: str, username: str) -> list:
    """Return the codes of the password rules that fail. An empty list means the password is accepted."""
    rules = [
        ("LENGTH", len(password) < 12),
        ("UPPER", not re.search(r"[A-Z]", password)),
        ("LOWER", not re.search(r"[a-z]", password)),
        ("DIGIT", not re.search(r"[0-9]", password)),
        ("SYMBOL", not re.search(r"[^A-Za-z0-9]", password)),
        ("CONTAINS_USERNAME", bool(username) and username.lower() in password.lower()),
        ("COMMON", password.lower() in _common_passwords()),
    ]
    return [code for code, failed in rules if failed]
