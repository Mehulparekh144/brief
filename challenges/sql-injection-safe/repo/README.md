# users

User store for the admin panel, on SQLite. The search box calls `GET /users?q=<text>`, which runs `handle_search()` in `users/api.py`.

```python
from users.store import UserStore

store = UserStore()
store.add("Ana Lee", "ana@example.com")
store.search_users("an")  # [{'id': 1, 'name': 'Ana Lee', 'email': 'ana@example.com'}]
```

Run the tests with `python3 -m unittest discover -s tests -v`.
