# appconfig

Loads the service config (`config.json`), checks it and fills in defaults.

```python
from appconfig.loader import load

load('{"host": "0.0.0.0", "port": 8080}')
# {'debug': False, 'workers': 4, 'log_level': 'info', 'host': '0.0.0.0', 'port': 8080}
```

An invalid config raises `ConfigError`; its `errors` attribute is the list from `validate()`.

Run the tests with `python3 -m unittest discover -s tests -v`.
