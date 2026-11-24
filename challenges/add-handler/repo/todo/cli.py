import sys

import todo.commands  # noqa: F401  importing it registers every command
from todo.registry import COMMANDS
from todo.store import Store


def main(argv, store=None, out=None):
    out = out or sys.stdout
    store = Store() if store is None else store
    if not argv or argv[0] == "help":
        print("Commands:", file=out)
        for name in sorted(COMMANDS):
            print(f"  {name:<8}{COMMANDS[name][1]}", file=out)
        return 0
    if argv[0] not in COMMANDS:
        print(f"Unknown command: {argv[0]}", file=out)
        return 2
    run, _help = COMMANDS[argv[0]]
    return run(argv[1:], store, out)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
