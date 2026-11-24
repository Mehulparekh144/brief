import json
import time

from logkit.redact import redact


class JsonLogger:
    """Writes one JSON object per line."""

    def __init__(self, stream, clock=time.time):
        self.stream = stream
        self.clock = clock

    def log(self, level, message, **fields):
        record = {"ts": round(self.clock(), 3), "level": level, "message": message, **fields}
        self.stream.write(json.dumps(redact(record), sort_keys=True) + "\n")

    def info(self, message, **fields):
        self.log("info", message, **fields)

    def error(self, message, **fields):
        self.log("error", message, **fields)
