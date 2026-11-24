import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from appconfig.loader import ConfigError, load  # noqa: E402
from appconfig.validate import validate  # noqa: E402

BASE = {"host": "0.0.0.0", "port": 8080}


def errors_for(**changes):
    return validate({**BASE, **changes})


class ConfigHiddenTest(unittest.TestCase):
    def test_hidden_valid_configs(self):
        self.assertEqual(validate(BASE), [])
        self.assertEqual(validate({**BASE, "debug": True, "workers": 64, "log_level": "warning", "port": 65535}), [])
        self.assertEqual(validate({**BASE, "workers": 1, "port": 1, "debug": False, "log_level": "error"}), [])

    def test_hidden_host_and_port_messages(self):
        for value in ["", "   ", 5, None]:
            with self.subTest(host=value):
                self.assertEqual(errors_for(host=value), ["host: must be a non-empty string"])
        for value in [0, 65536, "80", True, 8080.0]:
            with self.subTest(port=value):
                self.assertEqual(errors_for(port=value), ["port: must be an integer between 1 and 65535"])

    def test_hidden_optional_settings_messages(self):
        self.assertEqual(errors_for(debug="yes"), ["debug: must be true or false"])
        self.assertEqual(errors_for(debug=1), ["debug: must be true or false"])
        for value in [0, 65, True, "4"]:
            with self.subTest(workers=value):
                self.assertEqual(errors_for(workers=value), ["workers: must be an integer between 1 and 64"])
        for value in ["verbose", "INFO", None]:
            with self.subTest(log_level=value):
                self.assertEqual(errors_for(log_level=value), ["log_level: must be one of debug, info, warning, error"])

    def test_hidden_required_keys(self):
        self.assertEqual(validate({}), ["host: is required", "port: is required"])
        self.assertEqual(validate({"port": 80}), ["host: is required"])

    def test_hidden_unknown_keys(self):
        self.assertEqual(errors_for(colour="red", Debug=True), ["Debug: unknown setting", "colour: unknown setting"])

    def test_hidden_all_errors_sorted_by_key(self):
        config = {"workers": 0, "zone": "eu", "port": "x", "debug": 1}
        self.assertEqual(validate(config), [
            "debug: must be true or false",
            "host: is required",
            "port: must be an integer between 1 and 65535",
            "workers: must be an integer between 1 and 64",
            "zone: unknown setting",
        ])

    def test_hidden_load_uses_the_messages(self):
        with self.assertRaises(ConfigError) as ctx:
            load(json.dumps({"host": "", "port": 70000, "retries": 3}))
        self.assertEqual(ctx.exception.errors, ["host: must be a non-empty string", "port: must be an integer between 1 and 65535", "retries: unknown setting"])
        self.assertEqual(load(json.dumps(BASE)), {"debug": False, "workers": 4, "log_level": "info", **BASE})


if __name__ == "__main__":
    unittest.main()
