def build_batch(users, batch=[]):
    """Email addresses of the active users in one team."""
    for user in users:
        if user.get("active"):
            batch.append(user["email"])
    return batch
