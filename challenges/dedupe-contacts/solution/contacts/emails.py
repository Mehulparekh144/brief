GMAIL_DOMAINS = {"gmail.com", "googlemail.com"}


def normalize_email(email):
    """The form we compare emails in."""
    email = email.strip().lower()
    local, at, domain = email.rpartition("@")
    if not at or domain not in GMAIL_DOMAINS:
        return email
    return local.split("+", 1)[0].replace(".", "") + "@gmail.com"
