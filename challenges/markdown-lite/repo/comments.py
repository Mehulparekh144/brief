import html

from mdlite import render


def render_comment(author, body):
    """HTML for one comment. body is Markdown written by the reader."""
    return f'<article class="comment"><h4>{html.escape(author)}</h4>\n{render(body)}</article>'
