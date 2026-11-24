def summary(users):
    """One line per active user, sorted by name: 'ana <ana@example.com>'."""
    active = sorted((u for u in users if u.active), key=lambda u: u.username)
    return "\n".join(f"{u.username} <{u.email}>" for u in active)


def inactive_names(users):
    return [u.username for u in users if not u.active]
