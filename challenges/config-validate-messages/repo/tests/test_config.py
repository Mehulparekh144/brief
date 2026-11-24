import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from appconfig.loader import ConfigError, load  # noqa: E402
from appconfig.validate import validate  # noqa: E402


class ConfigTest(unittest.TestCase):
    def test_valid_config(self):
        self.assertEqual(validate({"host": "localhost", "port": 8080}), [])
        self.assertEqual(load('{"host": "localhost", "port": 80, "workers": 2}')["workers"], 2)

    def test_invalid_config_raises(self):
        with self.assertRaises(ConfigError) as ctx:
            load('{"port": 8080}')
        self.assertEqual(len(ctx.exception.errors), 1)


if __name__ == "__main__":
    unittest.main()
