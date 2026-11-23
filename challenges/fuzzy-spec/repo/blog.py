from slug import slugify


def post_url(title: str, year: int) -> str:
    return f"/blog/{year}/{slugify(title)}"
