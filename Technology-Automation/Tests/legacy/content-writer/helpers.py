"""Shared helpers for content-writer tests."""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
CHECK = REPO / ".claude" / "skills" / "content-writing" / "scripts" / "check_draft.py"
VALIDATE = REPO / ".claude" / "skills" / "content-learning" / "scripts" / "validate_knowledge.py"


def run_check(*args):
    import subprocess
    return subprocess.run([sys.executable, str(CHECK), *map(str, args)],
                          capture_output=True, text=True)


def verdict(proc):
    import json
    return json.loads(proc.stdout)


def run_validate(*args):
    import subprocess
    return subprocess.run([sys.executable, str(VALIDATE), *map(str, args)],
                          capture_output=True, text=True)
