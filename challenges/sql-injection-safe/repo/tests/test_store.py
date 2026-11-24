import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from users.api import handle_search  # noqa: E402
from users.store import UserStore  # noqa: E402


class StoreTest(unittest.TestCase):
    def setUp(self):
        self.store = UserStore()
        self.store.add("Ana Lee", "ana@example.com")
        self.store.add("Kim Park", "kim@example.com")

    def test_search(self):
        self.assertEqual(self.store.search_users("Ana"), [{"id": 1, "name": "Ana Lee", "email": "ana@example.com"}])
        self.assertEqual(handle_search(self.store, {"q": "Kim"})["count"], 1)

    def test_find_by_email(self):
        self.assertEqual(self.store.find_by_email("kim@example.com")["name"], "Kim Park")
        self.assertIsNone(self.store.find_by_email("nobody@example.com"))


if __name__ == "__main__":
    unittest.main()
