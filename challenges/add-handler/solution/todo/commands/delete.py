from todo.registry import command


@command("delete", "Delete a task by id")
def run(args, store, out):
    if len(args) != 1 or not args[0].isdigit():
        print("usage: delete <id>", file=out)
        return 2
    task = store.remove(int(args[0]))
    if task is None:
        print(f"No task {args[0]}", file=out)
        return 1
    print(f"Deleted task {task['id']}: {task['text']}", file=out)
    return 0
