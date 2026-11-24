from phone import to_e164


def import_contacts(rows):
    """rows: dicts with "name" and "phone". Returns (contacts, rejected names)."""
    contacts, rejected = [], []
    for row in rows:
        try:
            contacts.append({"name": row["name"].strip(), "phone": to_e164(row["phone"])})
        except ValueError:
            rejected.append(row["name"])
    return contacts, rejected
