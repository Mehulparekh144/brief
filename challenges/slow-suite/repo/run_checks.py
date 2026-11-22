"""Project checks. Usage: python3 run_checks.py [name ...]   e.g. python3 run_checks.py tax

Runs every check_* function in checks/*_checks.py. A full run takes about 20 seconds
because of the integration checks.
"""
import importlib
import sys
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def main(names: list[str]) -> int:
    modules = sorted(p.stem for p in (ROOT / "checks").glob("*_checks.py"))
    if names:
        modules = [m for m in modules if any(n in m for n in names)]
    ran = failed = 0
    for mod_name in modules:
        mod = importlib.import_module(f"checks.{mod_name}")
        for fn in sorted(n for n in dir(mod) if n.startswith("check_")):
            ran += 1
            try:
                getattr(mod, fn)()
                print(f"ok   {mod_name}.{fn}")
            except Exception:
                failed += 1
                print(f"FAIL {mod_name}.{fn}")
                traceback.print_exc(limit=1)
    print(f"Ran {ran} tests")
    print("OK" if not failed else f"FAILED (failures={failed})")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
