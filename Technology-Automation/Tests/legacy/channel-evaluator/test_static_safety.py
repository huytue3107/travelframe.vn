"""Static safety checks over channel-evaluation scripts."""
import ast
import hashlib
import json
import subprocess
import sys
import unittest
from pathlib import Path

from helpers import MERGE, METRICS, REPO


class StaticSafetyTests(unittest.TestCase):
    def test_no_shell_true(self):
        for path in (METRICS, MERGE):
            tree = ast.parse(path.read_text())
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    self.assertNotIn("shell=", ast.dump(node),
                                     f"{path.name} uses shell=")

    def test_no_env_or_apify_references(self):
        for path in (METRICS, MERGE):
            src = path.read_text()
            for forbidden in (".env", "APIFY_TOKEN", "apify_scrape",
                              "yt_dlp", "urllib.request", "requests"):
                self.assertNotIn(forbidden, src,
                                 f"{path.name} references {forbidden}")

    def test_no_network_in_metrics(self):
        tree = ast.parse(METRICS.read_text())
        imports = {n.names[0].name.split(".")[0] for n in ast.walk(tree)
                   if isinstance(n, ast.Import)}
        imports |= {n.module.split(".")[0] for n in ast.walk(tree)
                    if isinstance(n, ast.ImportFrom) and n.module}
        self.assertFalse(imports & {"socket", "http", "urllib", "requests"})


class RealDataTests(unittest.TestCase):
    """Run against the actual test-nasa dataset (read-only checks)."""

    def test_real_nasa_metrics_sane(self):
        import tempfile
        fixture = REPO / "reference-library/channels/test-nasa/instagram-posts.json"
        if not fixture.exists():
            self.skipTest("test-nasa source fixture is not present in this workspace")
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "m"
            r = subprocess.run(
                [sys.executable, str(METRICS), "--posts",
                 str(fixture),
                 "--out", out, "--now", "2026-09-12T00:00:00Z"],
                capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stderr)
            m = json.loads((out / "metrics.json").read_text())
            self.assertEqual(m["profile"]["username"], "nasa")
            self.assertEqual(m["stats"]["n_posts"], 12)
            # spot known value: pinned post DcOX3hWFiey likes 564892
            row = next(x for x in m["rows"] if x["shortCode"] == "DcOX3hWFiey")
            self.assertEqual(row["likes"], 564892)
            self.assertEqual(row["comments"], 4208)
            # ER never negative, never absurd (<= 100%)
            for x in m["rows"]:
                if x["er"] is not None:
                    self.assertLessEqual(x["er"], 1.0)
                    self.assertGreaterEqual(x["er"], 0.0)


if __name__ == "__main__":
    unittest.main()
