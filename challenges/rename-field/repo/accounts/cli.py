import sys

from accounts.report import summary
from accounts.store import dump_users, load_users


def main(argv=None, stdin=None, stdout=None):
    """accounts summary|export < users.json"""
    argv = sys.argv[1:] if argv is None else argv
    stdin, stdout = stdin or sys.stdin, stdout or sys.stdout
    users = load_users(stdin.read())
    print(dump_users(users) if argv[:1] == ["export"] else summary(users), file=stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
