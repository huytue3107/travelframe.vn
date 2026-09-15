"""transcribe.sh contract tests (run with a mock whisper binary)."""
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

from helpers import MOCK_WHISPER, TRANSCRIBE


class TranscribeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="tt-"))
        self.mock = self.tmp / "mockwhisper"
        self.mock.write_text(MOCK_WHISPER)
        self.mock.chmod(0o755)
        self.env = {"PATH": "/usr/bin:/bin", "WHISPER_BIN": str(self.mock),
                    "HOME": str(self.tmp)}
        self.video = self.tmp / "my video.mp4"
        self.video.write_text("fake video bytes")

    def run_script(self, *args, env=None):
        e = dict(self.env)
        if env:
            e.update(env)
        return subprocess.run(["bash", str(TRANSCRIBE), *map(str, args)],
                              capture_output=True, text=True, env=e)

    def transcripts_root(self):
        return self.tmp / "reference-library" / "transcripts"

    def test_unique_dir_per_run_and_provenance(self):
        r1 = self.run_script(self.video, "small")
        self.assertEqual(r1.returncode, 0, r1.stderr)
        r2 = self.run_script(self.video, "small")
        self.assertEqual(r2.returncode, 0, r2.stderr)
        dirs = sorted(p for p in self.transcripts_root().iterdir() if p.is_dir())
        self.assertEqual(len(dirs), 2)
        for d in dirs:
            self.assertEqual(d.name, "my video-" + d.name.split("my video-")[1])
            prov = json.loads((d / "provenance.json").read_text())
            self.assertEqual(prov["transcript"]["source"], "local_whisper")
            self.assertEqual(prov["transcript"]["model"], "small")
            self.assertEqual(prov["transcript"]["engine"], "openai-whisper")
            self.assertIn("language", prov["transcript"])
            self.assertEqual(len(prov["video"]["fingerprint_sha256"]), 64)

    def test_two_same_basename_files_do_not_collide(self):
        other = self.tmp / "sub" / "my video.mp4"
        other.write_text("different bytes")
        self.run_script(self.video, "small")
        self.run_script(other, "small")
        dirs = sorted(p for p in self.transcripts_root().iterdir() if p.is_dir())
        self.assertEqual(len(dirs), 2)
        contents = sorted((d / "provenance.json").read_text() for d in dirs)
        self.assertNotEqual(contents[0], contents[1])

    def test_refuse_overwrite_existing_transcripts(self):
        self.run_script(self.video, "small")
        target = sorted(p for p in self.transcripts_root().iterdir() if p.is_dir())[0]
        before = sorted(p.name for p in target.iterdir())
        r = self.run_script(self.video, "small", "--output-dir", target)
        self.assertEqual(r.returncode, 1)
        self.assertIn("refusing", r.stderr)
        self.assertEqual(before, sorted(p.name for p in target.iterdir()))

    def test_explicit_output_dir_allowed_when_empty(self):
        target = self.tmp / "custom-target"
        r = self.run_script(self.video, "medium", "--output-dir", target)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue((target / "provenance.json").exists())
        argv_log = (target / ".mockwhisper-argv.log").read_text()
        self.assertIn("--model medium", argv_log)

    def test_old_files_untouched_by_rerun(self):
        r1 = self.run_script(self.video, "small")
        first_dir = sorted(p for p in self.transcripts_root().iterdir() if p.is_dir())[0]
        srt = next(first_dir.glob("*.srt"))
        mtime = srt.stat().st_mtime_ns
        self.run_script(self.video, "small")
        self.assertEqual(srt.stat().st_mtime, mtime)

    def test_missing_whisper_errors_cleanly(self):
        r = self.run_script(self.video, "small", env={"WHISPER_BIN": ""})
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("whisper not found", r.stderr)

    def test_video_must_exist(self):
        r = self.run_script(self.tmp / "nope.mp4")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("not found", r.stderr)


if __name__ == "__main__":
    unittest.main()
