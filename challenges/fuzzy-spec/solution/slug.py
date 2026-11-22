import re
import unicodedata

MAX_LEN = 50


def slugify(title: str) -> str:
    """Turn a blog post title into a URL slug."""
    text = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode("ascii").lower()
    slug = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    if len(slug) > MAX_LEN:
        out = ""
        for word in slug.split("-"):
            candidate = f"{out}-{word}" if out else word
            if len(candidate) > MAX_LEN:
                break
            out = candidate
        slug = out or slug[:MAX_LEN]
    return slug or "post"
