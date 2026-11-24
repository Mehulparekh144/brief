def load_allowlist(lines):
    """Turn the lines of allowlist.txt into allowlist entries."""
    return [line.strip() for line in lines if line.strip() and not line.startswith("#")]


def is_allowed(ip, allowlist):
    """True when ip is inside one of the allowlist networks."""
    for entry in allowlist:
        network, _, bits = entry.partition("/")
        octets = int(bits or 32) // 8
        prefix = ".".join(network.split(".")[:octets])
        if ip.startswith(prefix):
            return True
    return False
