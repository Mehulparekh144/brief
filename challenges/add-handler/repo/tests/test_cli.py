import io
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from todo.cli import main  # noqa: E402
from todo.store import Store  # noqa: E402


def run(store, *argv):
    out = io.StringIO()
    code = main(list(argv), store, out)
    return code, out.getvalue()


class CliTest(unittest.TestCase):
    def test_add_done_list(self):
        store = Store()
        self.assertEqual(run(store, "add", "buy", "milk"), (0, "Added task 1: buy milk\n"))
        self.assertEqual(run(store, "done", "1"), (0, "Done task 1: buy milk\n"))
        self.assertEqual(run(store, "list"), (0, "[x] 1 buy milk\n"))

    def test_errors(self):
        store = Store()
        self.assertEqual(run(store, "done", "7"), (1, "No task 7\n"))
        self.assertEqual(run(store, "done"), (2, "usage: done <id>\n"))
        self.assertEqual(run(store, "nope"), (2, "Unknown command: nope\n"))

    def test_help_lists_commands(self):
        code, out = run(Store(), "help")
        self.assertEqual(code, 0)
        self.assertIn("  add     Add a task\n", out)
        self.assertIn("  list    List all tasks\n", out)


if __name__ == "__main__":
    unittest.main()
