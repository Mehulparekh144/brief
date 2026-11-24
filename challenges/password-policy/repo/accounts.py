from hashing import hash_password
from policy import check

USERS = {}


class WeakPassword(Exception):
    def __init__(self, codes):
        super().__init__(", ".join(codes))
        self.codes = codes


def sign_up(username: str, password: str) -> None:
    failed = check(password, username)
    if failed:
        raise WeakPassword(failed)
    USERS[username.lower()] = hash_password(password)
