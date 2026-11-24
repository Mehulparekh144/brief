import re

from contacts.emails import normalize_email


def dedupe(contacts):
    """Merge contacts that are the same person. Contacts are dicts: name, email, phones."""
    merged, out = {}, []
    for contact in contacts:
        email = normalize_email(contact["email"])
        if not email:
            out.append(dict(contact, phones=list(contact["phones"])))
            continue
        if email not in merged:
            merged[email] = {"name": "", "email": email, "phones": []}
            out.append(merged[email])
        person = merged[email]
        person["name"] = person["name"] or contact["name"]
        seen = {re.sub(r"\D", "", p) for p in person["phones"]}
        for phone in contact["phones"]:
            digits = re.sub(r"\D", "", phone)
            if digits not in seen:
                seen.add(digits)
                person["phones"].append(phone)
    return out
