import hashlib
import io
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from todo.cli import main  # noqa: E402
from todo.registry import COMMANDS  # noqa: E402
from todo.store import Store  # noqa: E402

ORIGINAL = {
    "todo/cli.py": "93298805887be0a77b63c3284d8afbe5c270a209cf8ca16299d36aadb68c9c0b",
    "todo/registry.py": "5ef325c1d6ae29f433085b91507347e66a9cc655b60871aef01b209d47a149be",
    "todo/store.py": "f753c502e504f6fd838ae4c4f7087152350c4d4bb254de95f4055dbcc08ff194",
    "todo/commands/add.py": "d5ff30cc07776b027e1b589c9f0161ab589b9fc3ab0d8921e5bf09dda1631689",
    "todo/commands/done.py": "af76a354e2298f1e4cfb61077cda5241bcd4768b349a3e9f5a434628e7c734b0",
    "todo/commands/ls.py": "b9ae5a6c907a62cbbb463cb68c95b26cfce630ab324f658a1d1c75b860b0b0b2",
}


def run(store, *argv):
    out = io.StringIO()
    code = main(list(argv), store, out)
    return code, out.getvalue()


def two_tasks():
    store = Store()
    store.add("buy milk")
    store.add("call mum")
    return store


class DeleteHiddenTest(unittest.TestCase):
    def test_hidden_registered_in_its_own_module(self):
        self.assertTrue((ROOT / "todo" / "commands" / "delete.py").exists(), "todo/commands/delete.py is missing")
        fn, help_text = COMMANDS["delete"]
        self.assertEqual(fn.__module__, "todo.commands.delete")
        self.assertEqual(help_text, "Delete a task by id")

    def test_hidden_help_line(self):
        code, out = run(Store(), "help")
        self.assertEqual(code, 0)
        self.assertIn("  delete  Delete a task by id\n", out)

    def test_hidden_delete_removes_the_task(self):
        store = two_tasks()
        self.assertEqual(run(store, "delete", "1"), (0, "Deleted task 1: buy milk\n"))
        self.assertEqual(run(store, "list"), (0, "[ ] 2 call mum\n"))

    def test_hidden_unknown_id(self):
        store = two_tasks()
        self.assertEqual(run(store, "delete", "9"), (1, "No task 9\n"))
        self.assertEqual(len(store.all()), 2)

    def test_hidden_bad_usage(self):
        for args in [(), ("x",), ("1", "2"), ("-1",)]:
            with self.subTest(args=args):
                self.assertEqual(run(two_tasks(), "delete", *args), (2, "usage: delete <id>\n"))

    def test_hidden_other_files_unchanged(self):
        for file, digest in ORIGINAL.items():
            now = hashlib.sha256((ROOT / file).read_bytes()).hexdigest()
            self.assertEqual(now, digest, f"{file} was changed")


if __name__ == "__main__":
    unittest.main()
