"""validate_knowledge.py contract tests + merge-rule fixture simulation."""
import json
import tempfile
import unittest
from pathlib import Path

from helpers import run_validate, verdict


VALID_PATTERNS = """## P-001 | Hook: câu hỏi first-time + promise   (confidence: 2 nguồn)
- Cấu trúc: question to the viewer plus one concrete benefit promise
- Nguồn: output/posts/exemplar.md (2026-09-11), Research-Insights/Library/analysis/youtube/x/run/analysis.md§3 (2026-09-12)
- Áp dụng cho TravelFrame: use in hook beat of reel scripts
"""

VALID_IDEAS = """## I-001 | Egg coffee morning walk reel   (confidence: 1 nguồn)
- Nguồn: Research-Insights/Library/channels/test/instagram-posts.json (2026-09-12)
- Góc cho TravelFrame: morning route angle with coffee stop
- Trạng thái: idea
"""

VALID_VOICE = """# Voice playbook

## Giọng & xưng hô
## V-01 | Warm local friend tone   (confidence: 3 nguồn)
- Cấu trúc: short warm sentences, local friend addressing
- Nguồn: output/posts/exemplar.md (2026-09-11)

## Cấu trúc câu
## Emoji & ký hiệu
## CTA chuẩn
## Hashtag & ký tên
## Cấm (guardrails)
"""


class ValidateKnowledgeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="kv-"))
        self.root = self.tmp / "ws"
        (self.root / "output" / "posts").mkdir(parents=True)
        (self.root / "output" / "posts" / "exemplar.md").write_text("exemplar\n")
        library = self.root / "Research-Insights" / "Library"
        (library / "analysis" / "youtube" / "x" / "run").mkdir(
            parents=True, exist_ok=True
        )
        (library / "analysis" / "youtube" / "x" / "run" / "analysis.md").write_text(
            "analysis\n"
        )
        (library / "channels" / "test").mkdir(parents=True, exist_ok=True)
        (library / "channels" / "test" / "instagram-posts.json").write_text("[]")
        self.kdir = library / "knowledge"
        self.kdir.mkdir(parents=True)

    def seed_valid(self):
        (self.kdir / "patterns.md").write_text(VALID_PATTERNS, encoding="utf-8")
        (self.kdir / "ideas-backlog.md").write_text(VALID_IDEAS, encoding="utf-8")
        (self.kdir / "voice-playbook.md").write_text(VALID_VOICE, encoding="utf-8")

    def test_valid_kb_passes(self):
        self.seed_valid()
        p = run_validate("--knowledge", self.kdir, "--root", self.root)
        v = verdict(p)
        self.assertTrue(v["valid"], v["errors"])
        self.assertEqual(p.returncode, 0)
        self.assertEqual(v["entry_counts"]["patterns.md"], 1)

    def test_missing_core_file_fails(self):
        (self.kdir / "patterns.md").write_text(VALID_PATTERNS, encoding="utf-8")
        p = run_validate("--knowledge", self.kdir, "--root", self.root)
        v = verdict(p)
        self.assertFalse(v["valid"])
        self.assertTrue(any("missing core file" in e for e in v["errors"]))

    def test_entry_without_pointer_rejected(self):
        self.seed_valid()
        (self.kdir / "patterns.md").write_text(
            "## P-002 | No pointer entry   (confidence: 1 nguồn)\n"
            "- Cấu trúc: something\n", encoding="utf-8")
        v = verdict(run_validate("--knowledge", self.kdir, "--root", self.root))
        self.assertFalse(v["valid"])
        self.assertTrue(any("P-002" in e and "pointer" in e for e in v["errors"]))

    def test_pointer_to_missing_file_fails(self):
        (self.kdir / "patterns.md").write_text(
            "## P-003 | Broken pointer   (confidence: 1 nguồn)\n"
            "- Nguồn: output/posts/does-not-exist.md (2026-09-12)\n",
            encoding="utf-8")
        v = verdict(run_validate("--knowledge", self.kdir, "--root", self.root))
        self.assertFalse(v["valid"])
        self.assertTrue(any("missing on disk" in e for e in v["errors"]))

    def test_duplicate_ids_across_files_fail(self):
        self.seed_valid()
        (self.kdir / "ideas-backlog.md").write_text(
            VALID_IDEAS + "\n## P-001 | duplicate of patterns id   (confidence: 1 nguồn)\n"
            "- Nguồn: output/posts/exemplar.md (2026-09-11)\n", encoding="utf-8")
        v = verdict(run_validate("--knowledge", self.kdir, "--root", self.root))
        self.assertFalse(v["valid"])
        self.assertTrue(any("duplicate entry ID P-001" in e for e in v["errors"]))

    def test_voice_sections_required(self):
        self.seed_valid()
        (self.kdir / "voice-playbook.md").write_text(
            "# Voice playbook\n## Giọng & xưng hô\n", encoding="utf-8")
        v = verdict(run_validate("--knowledge", self.kdir, "--root", self.root))
        self.assertFalse(v["valid"])
        self.assertTrue(any("missing section" in e for e in v["errors"]))

    def test_merge_fixture_preserves_and_bumps(self):
        """Simulated second learning run: old entry retained with bumped confidence,
        new entry added, superseded note dated — validate still passes."""
        self.seed_valid()
        merged = (VALID_PATTERNS
                  + "\n## P-002 | CTA: comment keyword + DM flow   (confidence: 2 nguồn)\n"
                  "- Cấu trúc: comment keyword triggers dm flow\n"
                  "- Nguồn: output/posts/exemplar.md (2026-09-11), "
                  "Research-Insights/Library/channels/test/digest.md§CTA (2026-09-12)\n"
                  "\n## P-009 | Old CTA guess   (confidence: 1 nguồn)\n"
                  "- Nguồn: output/posts/exemplar.md (2026-09-11)\n"
                  "- Ghi chú: superseded bởi P-002 (2026-09-12)\n")
        (self.kdir / "patterns.md").write_text(merged_text := merged, encoding="utf-8")
        runs = self.kdir / "runs" / "2026-09-12-exemplars"
        runs.mkdir(parents=True)
        (runs / "learning.md").write_text(
            "# Learning run 2026-09-12-exemplars\n- Trạng thái: learned\n"
            "- Thêm: P-002; cập nhật: P-001 (confidence 1→2); supersede: P-009\n",
            encoding="utf-8")
        (
            self.root
            / "Research-Insights"
            / "Library"
            / "channels"
            / "test"
            / "digest.md"
        ).write_text(
            "## CTA\ncomment keyword dm\n")
        v = verdict(run_validate("--knowledge", self.kdir, "--root", self.root))
        self.assertTrue(v["valid"], v["errors"])
        text = (self.kdir / "patterns.md").read_text(encoding="utf-8")
        # no silent deletion: P-009 still present with its supersede note
        self.assertIn("## P-009", text)
        self.assertIn("superseded bởi P-002", text)
        # run record exists
        self.assertTrue((runs / "learning.md").exists())


if __name__ == "__main__":
    unittest.main()
