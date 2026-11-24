Add a `delete` command to the todo CLI. Build it the same way as the other commands in todo/commands/.

- Put it in a new file: todo/commands/delete.py.
- Command name: `delete`. Help text, exactly: `Delete a task by id`.
- `delete <id>` removes the task and prints `Deleted task <id>: <text>`. Exit code 0.
- No id, more than one argument, or an id that is not a number: print `usage: delete <id>`. Exit code 2.
- An id that does not exist: print `No task <id>`. Exit code 1.
- Register it in todo/commands/__init__.py.
- Do not change any other file: cli.py, registry.py, store.py and the other commands stay exactly as they are. A hidden test checks this.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
