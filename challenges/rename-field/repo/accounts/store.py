import json

from accounts.models import User


def load_users(text):
    """Parse a JSON list of user records."""
    users = []
    for record in json.loads(text):
        if "user_name" not in record:
            raise ValueError("user_name is required")
        users.append(User(user_name=record["user_name"], email=record["email"], active=record.get("active", True)))
    return users


def dump_users(users):
    """Write users as a JSON list, one object per user."""
    return json.dumps([{"user_name": u.user_name, "email": u.email, "active": u.active} for u in users], indent=2)


def find_user(users, user_name):
    for u in users:
        if u.user_name == user_name:
            return u
    return None
