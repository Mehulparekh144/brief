def check(password: str, username: str) -> list:
    """Return the codes of the password rules that fail. An empty list means the password is accepted."""
    failed = []
    if len(password) < 8:
        failed.append("LENGTH")
    if not any(c.isdigit() for c in password):
        failed.append("DIGIT")
    return failed
