from pathlib import Path

from allowlist import is_allowed, load_allowlist

ALLOWLIST = load_allowlist((Path(__file__).parent / "allowlist.txt").read_text().splitlines())


def handle_admin(request):
    """request is a dict with at least "remote_addr". Returns (status, body)."""
    if not is_allowed(request.get("remote_addr"), ALLOWLIST):
        return 403, "forbidden"
    return 200, "welcome, admin"
