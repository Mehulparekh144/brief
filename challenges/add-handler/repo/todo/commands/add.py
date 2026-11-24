from todo.registry import command


@command("add", "Add a task")
def run(args, store, out):
    if not args:
        print("usage: add <text>", file=out)
        return 2
    task = store.add(" ".join(args))
    print(f"Added task {task['id']}: {task['text']}", file=out)
    return 0
