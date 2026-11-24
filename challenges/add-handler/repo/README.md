# todo

A small task-list CLI. Each command is one module in `todo/commands/`. A module registers its command with the `@command(name, help)` decorator from `todo/registry.py`, and `todo/commands/__init__.py` imports it.

```
$ python3 -m todo.cli help
Commands:
  add     Add a task
  done    Mark a task as done
  list    List all tasks
```

Run the tests with `python3 -m unittest discover -s tests -v`.
