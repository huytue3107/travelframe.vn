"""prepare_video.py data-contract tests — no paid services, no real network."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from helpers import PREPARE, make_video, sha256


def run_prepare(*args):
    return subprocess.run([sys.executable, str(PREPARE), *map(str, args)],
                          capture_output=True, text=True)


class PrepareTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="pv-"))
        self.video = make_video(self.tmp / "videos" / "youtube" / "run1" / "video.mp4")

    def write(self, rel, text):
        p = self.tmp / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        return p

    def source(self, run="run"):
        return json.loads((self.tmp / run / "source.json").read_text())

    def test_key_from_info_and_caption_match_by_id(self):
        self.write("videos/youtube/run1/info.json", json.dumps({
            "id": "abc123XYZ", "extractor": "YouTube",
            "webpage_url": "https://www.youtube.com/watch?v=abc123",
            "uploader": "Chan"}))
        self.write("posts.json", json.dumps([
            {"id": "zzz", "caption": "nope"},
            {"id": "abc123XYZ", "caption": "Right caption"}]))
        r = run_prepare("--video", self.video, "--posts", self.tmp / "posts.json",
                        "--out", self.tmp / "r1")
        self.assertEqual(r.returncode, 0, r.stderr)
        s = self.source("r1")
        self.assertEqual(s["video_key"], "youtube/abc123xyz")
        cap = s["texts"]["post_caption"]
        self.assertEqual(cap["status"], "matched")
        self.assertEqual(cap["matched_by"], "id")
        self.assertEqual(cap["value"], "Right caption")

    def test_caption_by_url_with_latest_posts_shape(self):
        self.write("videos/youtube/run1/info.json", json.dumps({
            "id": "vid2", "extractor": "YouTube",
            "webpage_url": "https://www.youtube.com/watch?v=vid2"}))
        self.write("profile.json", json.dumps([{
            "username": "someone",
            "latestPosts": [{"code": "XYZ", "caption": "wrong"},
                            {"id": "vid2", "caption": "latest match!"}]}]))
        run_prepare("--video", self.video, "--info",
                    self.tmp / "videos/youtube/run1/info.json",
                    "--posts", self.tmp / "profile.json", "--out", self.tmp / "r2")
        s = self.source("r2")
        cap = s["texts"]["post_caption"]
        self.assertEqual(cap["status"], "matched")
        self.assertEqual(cap["value"], "latest match!")
        self.assertEqual(cap["matched_by"], "id")

    def test_no_posts_means_missing_caption(self):
        run_prepare("--video", self.video, "--out", self.tmp / "r3")
        s = self.source("r3")
        self.assertEqual(s["texts"]["post_caption"]["status"], "missing")
        self.assertIn("post_caption", " ".join(s["missing"]))
        self.assertIn("no --posts passed", " ".join(s["notes"]))

    def test_conflicting_captions_unverified(self):
        self.write("videos/youtube/run1/info.json", json.dumps({
            "id": "dup", "extractor": "YouTube",
            "webpage_url": "https://www.youtube.com/watch?v=dup"}))
        self.write("posts.json", json.dumps([
            {"id": "dup", "caption": "one"},
            {"id": "dup", "caption": "two"}]))
        run_prepare("--video", self.video, "--posts", self.tmp / "posts.json",
                    "--out", self.tmp / "r4")
        cap = self.source("r4")["texts"]["post_caption"]
        self.assertEqual(cap["status"], "unverified")
        self.assertIn("post_caption", " ".join(self.source("r4")["unverified"]))

    def test_fuzzy_match_is_never_used(self):
        # same title text, different id and url → must NOT match
        self.write("videos/youtube/run1/info.json", json.dumps({
            "id": "target", "extractor": "YouTube",
            "webpage_url": "https://www.youtube.com/watch?v=target"}))
        self.write("posts.json", json.dumps([
            {"id": "other", "caption": "a unique caption here",
             "url": "https://youtube.com/watch?v=other"}]))
        run_prepare("--video", self.video, "--posts", self.tmp / "posts.json",
                    "--out", self.tmp / "r5")
        cap = self.source("r5")["texts"]["post_caption"]
        self.assertEqual(cap["status"], "missing")
        self.assertIsNone(cap["value"])

    def test_path_traversal_never_in_key(self):
        self.write("videos/youtube/run1/info.json", json.dumps({
            "id": "../../etc/passwd", "extractor": "YouTube"}))
        run_prepare("--video", self.video, "--info",
                    self.tmp / "videos/youtube/run1/info.json",
                    "--out", self.tmp / "r6")
        key = self.source("r6")["video_key"]
        self.assertNotIn("..", key)
        self.assertNotIn(":", key)
        self.assertFalse((self.tmp / "r6" / "etc").exists())

    def test_bare_file_gets_sha_key_and_fingerprint_invalidation(self):
        bare = self.tmp / "bare clip.mp4"
        make_video(bare)
        run_prepare("--video", bare, "--out", self.tmp / "b1")
        s = self.source("b1")
        self.assertEqual(s["platform"], "local")
        self.assertEqual(s["native_id"], sha256(bare)[:16])
        self.assertEqual(s["video_key"], f"local/{s['native_id']}")
        # modifying the file changes the key (cache invalidation)
        make_video(bare, seconds=3.0)
        run_prepare("--video", bare, "--out", self.tmp / "b2")
        s2 = self.source("b2")
        self.assertEqual(s2["native_id"], sha256(bare)[:16])
        self.assertNotEqual(s2["native_id"], s["native_id"])

    def test_transcript_provenance_vs_legacy(self):
        # verified dir (has provenance.json)
        self.write("tx1/provenance.json", json.dumps({
            "schema_version": 1, "video": {"fingerprint_sha256": "x"},
            "transcript": {"source": "local_whisper", "engine": "openai-whisper",
                           "model": "medium", "language": "en"}}))
        (self.tmp / "tx1" / "video.srt").write_text("1\n00:00:00,000 --> 00:00:01,000\nhi\n\n")
        # legacy dir: bare srt, no provenance
        self.tmp.joinpath("tx2").mkdir()
        (self.tmp / "tx2" / "video.srt").write_text("1\n00:00:00,000 --> 00:00:01,000\nlegacy\n\n")
        run_prepare("--video", self.video, "--transcripts", self.tmp / "tx1",
                    "--out", self.tmp / "v1")
        asr = self.source("v1")["texts"]["asr_transcript"]
        self.assertEqual(asr["status"], "present")
        self.assertTrue(asr["verified"])
        run_prepare("--video", self.video, "--transcripts", self.tmp / "tx2",
                    "--out", self.tmp / "v2")
        asr2 = self.source("v2")["texts"]["asr_transcript"]
        self.assertEqual(asr2["status"], "unverified")
        self.assertFalse(asr2["verified"])
        self.assertIn("asr_transcript", " ".join(self.source("v2")["unverified"]))

    def test_refuse_overwrite_source_json(self):
        run_prepare("--video", self.video, "--out", self.tmp / "ow")
        r = run_prepare("--video", self.video, "--out", self.tmp / "ow")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("refusing", r.stderr)

    def test_broken_clip_still_produces_source(self):
        bad = self.tmp / "videos" / "youtube" / "run1" / "broken.mp4"
        bad.write_bytes(b"not a real video" * 100)
        r = run_prepare("--video", bad, "--out", self.tmp / "brk")
        self.assertEqual(r.returncode, 0, r.stderr)
        s = self.source("brk")
        self.assertEqual(s["media"]["status"], "error")
        self.assertIn("media_probe", " ".join(s["unverified"]))

    def test_silent_video_recorded(self):
        silent = make_video(self.tmp / "silent.mp4", with_audio=False)
        run_prepare("--video", silent, "--out", self.tmp / "silent")
        s = self.source("silent")
        self.assertFalse(s["media"]["has_audio"])


if __name__ == "__main__":
    unittest.main()
