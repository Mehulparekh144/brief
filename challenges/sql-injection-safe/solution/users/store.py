from users.db import connect


def _like_prefix(text):
    """LIKE pattern for 'starts with text', with %, _ and \\ in the text matched literally."""
    return text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"


class UserStore:
    def __init__(self, conn=None):
        self.conn = conn if conn is not None else connect()

    def add(self, name, email):
        cur = self.conn.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
        return cur.lastrowid

    def search_users(self, name):
        """Users whose name starts with the search text, in any case."""
        name = name.strip()
        if not name:
            return []
        sql = "SELECT id, name, email FROM users WHERE name LIKE ? ESCAPE '\\' ORDER BY name COLLATE NOCASE, id"
        return [dict(row) for row in self.conn.execute(sql, (_like_prefix(name),))]

    def find_by_email(self, email):
        row = self.conn.execute("SELECT id, name, email FROM users WHERE email = ?", (email,)).fetchone()
        return dict(row) if row else None
