Our CSV import creates the same person two or three times. Make `dedupe(contacts)` merge them. Contacts are dicts with `name`, `email` and `phones`.

Emails (`normalize_email` in contacts/emails.py):
- Strip spaces and lowercase.
- For gmail.com and googlemail.com only: in the part before "@", drop everything from the first "+", and remove all dots. The domain becomes gmail.com.
- Other domains keep their dots and "+tags".

Merging (`dedupe` in contacts/dedupe.py):
- Contacts with the same normalized email are one person.
- The result keeps the order in which each person first appears.
- `name`: the first non-empty name of the group.
- `email`: the normalized email.
- `phones`: all phones of the group, in the order first seen, without duplicates.
- Two phones are the same if they have the same digits ("617-555-0101" and "(617) 555 0101"). Keep the first form seen.
- A contact with an empty email is never merged. Keep it as it is.
- Do not change the input contacts.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
