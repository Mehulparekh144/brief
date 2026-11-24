# admin-api

A small internal admin API. Only requests from the IPs in `allowlist.txt` get in.

- `allowlist.py` – `load_allowlist(lines)` and `is_allowed(ip, allowlist)`
- `allowlist.txt` – one IPv4 network per line, `#` for comments
- `app.py` – the request handler

Run the tests with `python3 -m unittest discover -s tests -v`.
