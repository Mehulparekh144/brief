# accounts

Loads user records from JSON, prints a summary and exports them again.

```python
from accounts.store import dump_users, load_users

users = load_users('[{"user_name": "ana", "email": "ana@example.com"}]')
users[0].user_name  # 'ana'
print(dump_users(users))
```

Export format:

```json
[
  {
    "user_name": "ana",
    "email": "ana@example.com",
    "active": true
  }
]
```

CLI: `python3 -m accounts.cli summary < users.json` or `python3 -m accounts.cli export < users.json`.

Run the tests with `python3 -m unittest discover -s tests -v`.
