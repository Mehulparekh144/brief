The admin API lets in only the IPs in `allowlist.txt`. The check in `allowlist.py` compares text prefixes, so `100.1.2.3` gets in through `10.0.0.0/8`. Make it safe.

`load_allowlist(lines)` reads the file lines:
- Strip each line. Skip empty lines and lines that start with `#`.
- Every other line is one IPv4 network in CIDR form, like `10.20.0.0/16`. A bare address, like `203.0.113.7`, means a /32.
- A bad entry raises `ValueError` at once, in `load_allowlist`. Bad means: not IPv4, a prefix outside 0–32, host bits set (`10.0.0.1/8`), or extra text (`10.0.0.0/8 office`).
- A prefix shorter than /8 is too broad and raises `ValueError`. This includes `0.0.0.0/0`.

`is_allowed(ip, allowlist)` returns `True` only when `ip` is in one of the networks:
- It never raises. A bad `ip` gives `False`.
- `ip` must be a `str`. An int or bytes gives `False`, even when Python can read it as an address.
- Only plain IPv4 text is valid: no spaces, no leading zeros (`010.0.0.1`), no `/32`, no IPv6 (also not `::ffff:10.0.0.1`).
- An empty allowlist allows nothing.

Use the standard library. Keep both function names and their arguments.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
