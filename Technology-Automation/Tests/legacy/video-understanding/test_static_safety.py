"""Static safety checks over the skill + channel-agent scripts."""
import re
import unittest
from pathlib import Path

from helpers import EXTRACT, PREPARE, TRANSCRIBE

SKILL_DIR = EXTRACT.parents[1]


class StaticSafetyTests(unittest.TestCase):
    def test_no_shell_true_in_scripts(self):
        for path in (PREPARE, EXTRACT):
            src = path.read_text()
            self.assertNotIn("shell=True", src, f"{path} uses shell=True")

    def test_no_env_reading_in_skill_scripts(self):
        for path in (PREPARE, EXTRACT):
            src = path.read_text()
            self.assertNotIn(".env", src, f"{path} references .env")
            self.assertNotIn("APIFY_TOKEN", src, f"{path} references APIFY_TOKEN")

    def test_no_hardcoded_machine_paths_in_transcribe(self):
        src = TRANSCRIBE.read_text()
        self.assertNotIn("/Users/macbook", src)

    def test_vendored_code_untouched(self):
        checksum = (
            "ad317574facd619ff0c5ccbbb86a08b76abc8419c81107d179dbe2a3ba526ae6")
        import hashlib
        digest = hashlib.sha256(
            (SKILL_DIR / "scripts" / "vendor" / "claude_video" / "frames.py")
            .read_bytes()).hexdigest()
        self.assertEqual(digest, checksum)

    def test_subprocess_calls_use_argv(self):
        import ast
        for path in (PREPARE, EXTRACT):
            tree = ast.parse(path.read_text())
            for node in ast.walk(tree):
                if isinstance(node, ast.Call) and getattr(node.func, "id", "") == "subprocess.run":
                    flat = ast.dump(node)
                    self.assertNotIn("shell=", flat)
                if isinstance(node, ast.Call) and getattr(node.func, "attr", "") == "run" \
                        and getattr(node.func.value, "id", "") == "subprocess":
                    flat = ast.dump(node)
                    self.assertNotIn("shell=", flat)


if __name__ == "__main__":
    unittest.main()
