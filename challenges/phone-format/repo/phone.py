import re


def to_e164(raw: str, default_country: str = "US") -> str:
    """Normalize a phone number to E.164, for example "+16175550142"."""
    digits = re.sub(r"\D", "", raw)
    return "+1" + digits
