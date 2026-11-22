def build_batch(users, batch=None):
    """Email addresses of the active users in one team."""
    if batch is None:
        batch = []
    for user in users:
        if user.get("active"):
            batch.append(user["email"])
    return batch
