"""extract_frames.py tests — real ffmpeg on synthetic lavfi clips."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from helpers import EXTRACT, make_video


def run_extract(*args):
    return subprocess.run([sys.executable, str(EXTRACT), *map(str, args)],
                          capture_output=True, text=True)


class ExtractTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="ef-"))
        self.video = make_video(self.tmp / "clip.mp4", seconds=4.0)

    def test_frames_within_duration_and_readable(self):
        r = run_extract(self.video, "--out", self.tmp / "f1")
        self.assertEqual(r.returncode, 0, r.stderr)
        doc = json.loads((self.tmp / "f1" / "frames.json").read_text())
        self.assertGreater(len(doc["frames"]), 0)
        for fr in doc["frames"]:
            p = Path(fr["path"])
            self.assertTrue(p.exists())
            self.assertTrue(fr["timestamp_seconds"] >= 0.0)
            self.assertLessEqual(fr["timestamp_seconds"], 4.0)
            self.assertTrue(p.read_bytes().startswith(b"\xff\xd8"))  # JPEG magic

    def test_focused_pass_respects_window(self):
        r = run_extract(self.video, "--out", self.tmp / "f2",
                        "--start", "0", "--end", "2")
        self.assertEqual(r.returncode, 0, r.stderr)
        doc = json.loads((self.tmp / "f2" / "frames.json").read_text())
        self.assertTrue(doc["focused"])
        for fr in doc["frames"]:
            self.assertLessEqual(fr["timestamp_seconds"], 2.0)

    def test_no_dedup_keeps_budget(self):
        r = run_extract(self.video, "--out", self.tmp / "f3", "--no-dedup")
        self.assertEqual(r.returncode, 0, r.stderr)
        doc = json.loads((self.tmp / "f3" / "frames.json").read_text())
        self.assertFalse(doc["dedup"])
        self.assertLessEqual(len(doc["frames"]), 100)

    def test_overwrite_refusal(self):
        run_extract(self.video, "--out", self.tmp / "f4")
        r = run_extract(self.video, "--out", self.tmp / "f4")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("refusing", r.stderr)
        r2 = run_extract(self.video, "--out", self.tmp / "f5")
        self.assertEqual(r2.returncode, 0, r2.stderr)
        self.assertTrue((self.tmp / "f5" / "frames.json").exists())

    def test_broken_clip_fails_cleanly(self):
        bad = self.tmp / "broken.mp4"
        bad.write_bytes(b"junk" * 4096)
        r = run_extract(bad, "--out", self.tmp / "f3")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("ffprobe", r.stderr)

    def test_path_with_spaces(self):
        out = self.tmp / "frames dir with spaces"
        r = run_extract(self.video, "--out", out)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue((out / "frames.json").exists())


if __name__ == "__main__":
    unittest.main()
