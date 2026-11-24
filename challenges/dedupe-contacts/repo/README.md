# contacts

Imports contacts from CSV exports (`name,email,phones`, phones split by `;`) and merges duplicates.

```python
from contacts.importer import import_contacts

import_contacts(open("export.csv").read())
# [{"name": "Ana Lee", "email": "analee@gmail.com", "phones": ["617-555-0101"]}, ...]
```

Run the tests with `python3 -m unittest discover -s tests -v`.
