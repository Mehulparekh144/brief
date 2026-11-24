import json

from accounts.models import User


def load_users(text):
    """Parse a JSON list of user records."""
    users = []
    for record in json.loads(text):
        # "user_name" is the key in exports made before the rename.
        name = record.get("username", record.get("user_name"))
        if name is None:
            raise ValueError("username is required")
        users.append(User(username=name, email=record["email"], active=record.get("active", True)))
    return users


def dump_users(users):
    """Write users as a JSON list, one object per user."""
    return json.dumps([{"username": u.username, "email": u.email, "active": u.active} for u in users], indent=2)


def find_user(users, username):
    for u in users:
        if u.username == username:
            return u
    return None
