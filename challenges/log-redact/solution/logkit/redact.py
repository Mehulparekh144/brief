import re

SENSITIVE = {"password", "token", "secret", "api_key"}
_BEARER = re.compile(r"(?i)\b(bearer\s+)\S+")
_EMAIL = re.compile(r"([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})")


def redact(record):
    """Return a copy of a log record that is safe to write."""
    if isinstance(record, dict):
        return {k: "***" if isinstance(k, str) and k.lower() in SENSITIVE else redact(v) for k, v in record.items()}
    if isinstance(record, list):
        return [redact(v) for v in record]
    if isinstance(record, str):
        return _EMAIL.sub(r"\1***@\2", _BEARER.sub(r"\1***", record))
    return record
