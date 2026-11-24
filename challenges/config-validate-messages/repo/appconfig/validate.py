from appconfig.schema import REQUIRED


def validate(config):
    """Return a list of error messages. An empty list means the config is valid."""
    errors = []
    for key in REQUIRED:
        if key not in config:
            errors.append(f"missing {key}")
    if "port" in config and not isinstance(config["port"], int):
        errors.append("port must be an int")
    # TODO: check the other settings and unknown keys
    return errors
