"""Shared helpers for channel-evaluator tests."""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
METRICS = REPO / ".claude" / "skills" / "channel-evaluation" / "scripts" / "channel_metrics.py"
MERGE = REPO / ".claude" / "skills" / "channel-evaluation" / "scripts" / "merge_scores.py"


def run_metrics(*args):
    return subprocess.run([sys.executable, str(METRICS), *map(str, args)],
                          capture_output=True, text=True)


def run_merge(*args):
    return subprocess.run([sys.executable, str(MERGE), *map(str, args)],
                          capture_output=True, text=True)


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))
