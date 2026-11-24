import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from users.api import handle_search  # noqa: E402
from users.db import connect  # noqa: E402
from users.store import UserStore  # noqa: E402

NAMES = ["Ana Lee", "andrew", "Diana", "ANNA", "50% Club", "500 Fans", "a_b", "axb", "back\\slash", "backup", "bob", "Bob", "BOB", "Bobby"]


class SpyCursor:
    def __init__(self, cursor, log):
        self._cursor, self._log = cursor, log

    def execute(self, sql, params=()):
        self._log.append(sql)
        self._cursor.execute(sql, params)
        return self

    def __iter__(self):
        return iter(self._cursor)

    def __getattr__(self, name):
        return getattr(self._cursor, name)


class SpyConnection:
    """Records every SQL string the store sends."""

    def __init__(self, conn):
        self._conn, self.sql = conn, []

    def execute(self, sql, params=()):
        self.sql.append(sql)
        return self._conn.execute(sql, params)

    def cursor(self):
        return SpyCursor(self._conn.cursor(), self.sql)

    def __getattr__(self, name):
        return getattr(self._conn, name)


def store_with_users(conn=None):
    store = UserStore(conn if conn is not None else connect())
    for i, name in enumerate(NAMES):
        store.add(name, f"user{i}@example.com")
    return store


def names(rows):
    return [row["name"] for row in rows]


class StoreHiddenTest(unittest.TestCase):
    def test_hidden_user_text_never_in_sql(self):
        spy = SpyConnection(connect())
        store = store_with_users(spy)
        spy.sql.clear()
        store.search_users("zq' OR 1=1 --")
        store.find_by_email("zq@example.com' OR '1'='1")
        self.assertTrue(spy.sql, "the store sent no SQL")
        for sql in spy.sql:
            self.assertNotIn("zq", sql, "user text is inside the SQL string; pass it as a parameter")

    def test_hidden_injection_strings(self):
        store = store_with_users()
        for attack in ["' OR 1=1 --", "x' OR '1'='1", "'; DROP TABLE users; --", "%' OR name LIKE '%"]:
            with self.subTest(attack=attack):
                self.assertEqual(store.search_users(attack), [])
                self.assertIsNone(store.find_by_email(attack))
        self.assertEqual(len(store.search_users("b")), 6, "the users table must still be there")

    def test_hidden_prefix_and_case(self):
        store = store_with_users()
        self.assertEqual(names(store.search_users("an")), ["Ana Lee", "andrew", "ANNA"])
        self.assertEqual(names(store.search_users("LEE")), [])
        self.assertEqual(names(store.search_users("  diana ")), ["Diana"])

    def test_hidden_wildcards_are_literal(self):
        store = store_with_users()
        self.assertEqual(names(store.search_users("50%")), ["50% Club"])
        self.assertEqual(names(store.search_users("a_")), ["a_b"])
        self.assertEqual(names(store.search_users("%")), [])
        self.assertEqual(names(store.search_users("_")), [])

    def test_hidden_backslash_is_literal(self):
        store = store_with_users()
        self.assertEqual(names(store.search_users("back\\")), ["back\\slash"])
        self.assertEqual(names(store.search_users("back")), ["back\\slash", "backup"])

    def test_hidden_order_by_name_then_id(self):
        store = store_with_users()
        self.assertEqual(names(store.search_users("bo")), ["bob", "Bob", "BOB", "Bobby"])

    def test_hidden_empty_search(self):
        store = store_with_users()
        self.assertEqual(store.search_users(""), [])
        self.assertEqual(store.search_users("   "), [])
        self.assertEqual(handle_search(store, {}), {"count": 0, "results": []})

    def test_hidden_rows_and_email_lookup(self):
        store = store_with_users()
        self.assertEqual(store.search_users("Diana"), [{"id": 3, "name": "Diana", "email": "user2@example.com"}])
        self.assertEqual(store.find_by_email("user3@example.com"), {"id": 4, "name": "ANNA", "email": "user3@example.com"})


if __name__ == "__main__":
    unittest.main()
