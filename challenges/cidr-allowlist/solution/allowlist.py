import ipaddress

MIN_PREFIX = 8  # anything broader than a /8 is a config mistake, not an allowlist


def load_allowlist(lines):
    """Parse the lines of allowlist.txt into IPv4 networks. A bad entry raises ValueError."""
    networks = []
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        network = ipaddress.IPv4Network(line)  # strict: host bits set raise; a bare address is a /32
        if network.prefixlen < MIN_PREFIX:
            raise ValueError(f"allowlist entry is too broad: {line}")
        networks.append(network)
    return networks


def is_allowed(ip, allowlist):
    """True when ip (IPv4 text) is inside one of the networks. Never raises."""
    if not isinstance(ip, str):
        return False
    try:
        address = ipaddress.IPv4Address(ip)
    except ValueError:
        return False
    return any(address in network for network in allowlist)
