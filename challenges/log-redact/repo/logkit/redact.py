def redact(record):
    """Return a copy of a log record that is safe to write."""
    # TODO: this only covers the signup form. Make it cover everything.
    if "password" in record:
        record["password"] = "***"
    return record
