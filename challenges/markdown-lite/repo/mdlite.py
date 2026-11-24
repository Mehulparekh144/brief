import re


def render(md):
    """Markdown subset -> HTML: # headings, paragraphs, **bold**, *em* and [links](url)."""
    out = []
    for block in md.split("\n\n"):
        block = block.strip()
        if not block:
            continue
        if block.startswith("### "):
            out.append(f"<h3>{_inline(block[4:])}</h3>")
        elif block.startswith("## "):
            out.append(f"<h2>{_inline(block[3:])}</h2>")
        elif block.startswith("# "):
            out.append(f"<h1>{_inline(block[2:])}</h1>")
        else:
            out.append(f"<p>{_inline(block)}</p>")
    return "\n".join(out)


def _inline(text):
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
    return re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', text)
