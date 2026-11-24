from todo.registry import command


@command("done", "Mark a task as done")
def run(args, store, out):
    if len(args) != 1 or not args[0].isdigit():
        print("usage: done <id>", file=out)
        return 2
    task = store.get(int(args[0]))
    if task is None:
        print(f"No task {args[0]}", file=out)
        return 1
    task["done"] = True
    print(f"Done task {task['id']}: {task['text']}", file=out)
    return 0
