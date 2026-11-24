def summary(users):
    """One line per active user, sorted by name: 'ana <ana@example.com>'."""
    active = sorted((u for u in users if u.active), key=lambda u: u.user_name)
    return "\n".join(f"{u.user_name} <{u.email}>" for u in active)


def inactive_names(users):
    return [u.user_name for u in users if not u.active]
