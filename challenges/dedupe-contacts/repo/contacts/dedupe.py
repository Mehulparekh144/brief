from contacts.emails import normalize_email


def dedupe(contacts):
    """Merge contacts that are the same person. Contacts are dicts: name, email, phones."""
    seen = {}
    for contact in contacts:
        seen.setdefault(normalize_email(contact["email"]), contact)
    return list(seen.values())
