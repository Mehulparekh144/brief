from users.db import connect


class UserStore:
    def __init__(self, conn=None):
        self.conn = conn if conn is not None else connect()

    def add(self, name, email):
        cur = self.conn.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
        return cur.lastrowid

    def search_users(self, name):
        """Users whose name matches the text typed in the search box."""
        sql = f"SELECT id, name, email FROM users WHERE name LIKE '%{name}%' ORDER BY id"
        return [dict(row) for row in self.conn.execute(sql)]

    def find_by_email(self, email):
        row = self.conn.execute(f"SELECT id, name, email FROM users WHERE email = '{email}'").fetchone()
        return dict(row) if row else None
