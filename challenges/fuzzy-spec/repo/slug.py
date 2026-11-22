def slugify(title: str) -> str:
    """Turn a blog post title into a URL slug."""
    return title.lower().replace(" ", "-")
