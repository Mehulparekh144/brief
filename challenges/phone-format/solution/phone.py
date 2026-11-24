import re


def to_e164(raw: str, default_country: str = "US") -> str:
    """Normalize a phone number to E.164, for example "+16175550142"."""
    s = re.sub(r"[ .()\-]", "", raw)
    if s.startswith("00"):
        s = "+" + s[2:]
    plus = s.startswith("+")
    digits = s[1:] if plus else s
    if not re.fullmatch(r"[0-9]+", digits):
        raise ValueError(f"not a phone number: {raw!r}")
    if plus:
        if not 8 <= len(digits) <= 15:
            raise ValueError(f"wrong length: {raw!r}")
        return "+" + digits
    if default_country != "US":
        raise ValueError(f"unsupported country: {default_country!r}")
    if len(digits) == 10:
        return "+1" + digits
    if len(digits) == 11 and digits.startswith("1"):
        return "+" + digits
    raise ValueError(f"not a US number: {raw!r}")
