We are renaming the user field `user_name` to `username`. Old export files still exist, so they must keep loading.

- Rename `user_name` to `username` in the `User` class, in every module in accounts/ and in the tests.
- `find_user(users, username)`: rename the parameter too.
- `dump_users()` writes the key `"username"`. It never writes `"user_name"`.
- `load_users()` accepts both keys. If a record has both, `username` wins.
- A record with neither key raises `ValueError("username is required")`.
- The old name may stay only in the loader in accounts/store.py.
- Update the README example and export format. The README shows only the new name.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
