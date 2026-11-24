COMMANDS = {}


def command(name, help):
    """Register a command: @command("add", "Add a task"). The function gets (args, store, out) and returns an exit code."""

    def register(fn):
        COMMANDS[name] = (fn, help)
        return fn

    return register
