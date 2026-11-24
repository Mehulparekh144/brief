from appconfig.schema import LOG_LEVELS, REQUIRED


def _int_between(low, high):
    return lambda v: isinstance(v, int) and not isinstance(v, bool) and low <= v <= high


RULES = {
    "host": (lambda v: isinstance(v, str) and v.strip() != "", "must be a non-empty string"),
    "port": (_int_between(1, 65535), "must be an integer between 1 and 65535"),
    "debug": (lambda v: isinstance(v, bool), "must be true or false"),
    "workers": (_int_between(1, 64), "must be an integer between 1 and 64"),
    "log_level": (lambda v: v in LOG_LEVELS, "must be one of " + ", ".join(LOG_LEVELS)),
}


def validate(config):
    """Return a list of error messages, sorted by key. An empty list means the config is valid."""
    errors = {key: "is required" for key in REQUIRED if key not in config}
    for key, value in config.items():
        if key not in RULES:
            errors[key] = "unknown setting"
        elif not RULES[key][0](value):
            errors[key] = RULES[key][1]
    return [f"{key}: {errors[key]}" for key in sorted(errors)]
