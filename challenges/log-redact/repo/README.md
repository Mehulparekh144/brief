# logkit

JSON-lines logging for our services. Every record goes through `redact()` before it is written, so secrets and personal data never reach the log files.

```python
import sys
from logkit.logger import JsonLogger

log = JsonLogger(sys.stdout)
log.info("signup", email="ana@example.com", password="hunter2")
```

Run the tests with `python3 -m unittest discover -s tests -v`.
