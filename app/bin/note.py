#!/usr/bin/env python3
import os
import subprocess
import sys
from pathlib import Path


def main():
    base = Path(__file__).resolve().parent
    py_entry = base / "main.py"
    js_entry = base / "main.js"

    if py_entry.exists():
        result = subprocess.run(
            [sys.executable, str(py_entry), *sys.argv[1:]],
            stdout=sys.stdout,
            stderr=sys.stderr,
        )

        if result.returncode == 0:
            return 0

        # Python does not support this command, fall back to JS if available.
        if result.returncode == 2 and js_entry.exists():
            os.execvp("node", ["node", str(js_entry), *sys.argv[1:]])
            return 1

        return result.returncode

    if js_entry.exists():
        os.execvp("node", ["node", str(js_entry), *sys.argv[1:]])

    print("No note implementation found in bin/main.py or bin/main.js", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
