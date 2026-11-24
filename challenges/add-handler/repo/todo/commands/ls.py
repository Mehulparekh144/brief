from todo.registry import command


@command("list", "List all tasks")
def run(args, store, out):
    tasks = store.all()
    if not tasks:
        print("No tasks", file=out)
    for t in tasks:
        mark = "x" if t["done"] else " "
        print(f"[{mark}] {t['id']} {t['text']}", file=out)
    return 0
