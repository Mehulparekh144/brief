def log_request(logger, method, path, headers, body=None):
    """Log one incoming HTTP request with its headers and parsed JSON body."""
    logger.info(f"{method} {path}", headers=dict(headers), body=body)
