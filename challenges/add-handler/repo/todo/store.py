class Store:
    """Tasks in memory, keyed by id. Ids start at 1 and are never reused."""

    def __init__(self):
        self.tasks = {}
        self.next_id = 1

    def add(self, text):
        task = {"id": self.next_id, "text": text, "done": False}
        self.tasks[task["id"]] = task
        self.next_id += 1
        return task

    def get(self, task_id):
        return self.tasks.get(task_id)

    def remove(self, task_id):
        return self.tasks.pop(task_id, None)

    def all(self):
        return list(self.tasks.values())
