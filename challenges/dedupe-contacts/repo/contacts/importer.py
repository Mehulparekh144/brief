import csv
import io

from contacts.dedupe import dedupe


def load_csv(text):
    """Rows of name,email,phones (phones split by ';') -> contact dicts."""
    rows = csv.DictReader(io.StringIO(text))
    return [
        {"name": row["name"].strip(), "email": row["email"].strip(), "phones": [p.strip() for p in row["phones"].split(";") if p.strip()]}
        for row in rows
    ]


def import_contacts(text):
    return dedupe(load_csv(text))
