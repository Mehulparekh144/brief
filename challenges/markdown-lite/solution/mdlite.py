import html
import re

_HEADING = re.compile(r"(#{1,3}) (.*)")
_LINK = re.compile(r"\[([^\]]+)\]\(([^\s)]+)\)")


def render(md):
    """Markdown subset -> HTML: # headings, paragraphs, **bold**, *em* and http(s) [links](url). HTML is escaped first."""
    out, para = [], []

    def end_paragraph():
        if para:
            out.append(f"<p>{_inline(' '.join(para))}</p>")
            para.clear()

    for line in html.escape(md).split("\n"):
        line = line.strip()
        heading = _HEADING.fullmatch(line)
        if not line:
            end_paragraph()
        elif heading:
            end_paragraph()
            n = len(heading.group(1))
            out.append(f"<h{n}>{_inline(heading.group(2).strip())}</h{n}>")
        else:
            para.append(line)
    end_paragraph()
    return "\n".join(out)


def _link(m):
    text, url = m.group(1), m.group(2)
    if url.lower().startswith(("http://", "https://")):
        return f'<a href="{url}">{text}</a>'
    return text


def _inline(text):
    text = _LINK.sub(_link, text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    return re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
