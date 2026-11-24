import json

from appconfig.schema import DEFAULTS
from appconfig.validate import validate


class ConfigError(ValueError):
    def __init__(self, errors):
        super().__init__("invalid config:\n" + "\n".join(f"  {e}" for e in errors))
        self.errors = errors


def load(text):
    config = json.loads(text)
    errors = validate(config)
    if errors:
        raise ConfigError(errors)
    return {**DEFAULTS, **config}
