from pathlib import Path

from csv_reader import parse_csv


def load_contacts(path: Path) -> list:
    contacts = []
    for row in parse_csv(path.read_text(newline="")):
        email = row.get("email", "").strip().lower()
        if "@" not in email:
            continue
        contacts.append({"name": row["name"].strip(), "email": email, "company": row.get("company", "")})
    return contacts


if __name__ == "__main__":
    for c in load_contacts(Path(__file__).resolve().parent / "sample" / "contacts.csv"):
        print(c)
