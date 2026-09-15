"""check_draft.py contract tests with inline fixtures."""
import json
import tempfile
import unittest
from pathlib import Path

from helpers import run_check, verdict


class CheckDraftBase(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="cw-"))

    def write(self, name, text):
        p = self.tmp / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        return p

    def knowledge(self):
        kdir = self.tmp / "knowledge"
        kdir.mkdir()
        (kdir / "patterns.md").write_text(
            "## P-001 | Hook: câu hỏi first-time + promise   (confidence: 2 nguồn)\n"
            "- Nguồn: Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (2026-09-11)\n",
            encoding="utf-8")
        return kdir

    SOURCES_MD = "## Patterns used\n- P-001\n"

    def check(self, draft, dtype, **kw):
        args = ["--draft", str(draft), "--type", dtype]
        for flag, val in kw.items():
            args.append(f"--{flag.replace('_', '-')}")
            if val is True or val is False:
                if not val:
                    args.pop()  # store_false flag not passed
                continue
            if isinstance(val, list):
                args += list(map(str, val))
            else:
                args.append(str(val))
        return run_check(*args)


REEL_GOOD = """## Hook (0-3s)
First time in Hanoi? Here is the one mistake to skip.

## Beats
Beat one: land, walk, breathe.
Pro move: carry small cash and go early.

## CTA
Save this and send it to your travel buddy.
TravelFrame — your local friend in Hanoi

#hanoi #vietnamtravel #vietnamtips #travelframe
"""

REEL_MISSING_VOICE = """## Hook (0-3s)
Some hook text about the city.

## Beats
A beat about the market.
Another beat about the lake.

## CTA
Some closing line here.
"""

EXTERNAL = ("Everyone lands and immediately buys a sim card at the airport "
            "counter before checking anything at all.\n")

OVERLAP_DRAFT = """My honest take follows here.
Everyone lands and immediately buys a sim card at the airport counter before
checking anything at all.
#hanoi #vietnamtravel #vietnamtips #travelframe
"""


class ReelTests(CheckDraftBase):
    def test_good_reel_passes(self):
        sources = self.tmp / "external.md"
        sources.write_text("totally unrelated external text about another city.\n")
        md = self.write("sources.md", self.SOURCES_MD)
        d = self.write("reel.md", REEL_GOOD)
        p = self.check(d, "reel", sources_md=md, knowledge=self.knowledge(),
                       sources=[sources])
        v = verdict(p)
        self.assertEqual(v["status"], "pass")
        self.assertEqual(p.returncode, 0)

    def test_missing_voice_flags(self):
        d = self.write("reel2.md", REEL_MISSING_VOICE)
        md = self.write("sources.md", self.SOURCES_MD)
        p = self.check(d, "reel", sources_md=md, knowledge=self.knowledge())
        v = verdict(p)
        self.assertEqual(v["status"], "flagged")
        self.assertTrue(any("sign-off" in f for f in v["flags"]))
        self.assertTrue(any("hashtag" in f for f in v["flags"]))
        self.assertEqual(p.returncode, 0)

    def test_verbatim_overlap_is_hard_fail(self):
        sources = self.tmp / "external.md"
        sources.write_text(EXTERNAL)
        d = self.write("bad.md", OVERLAP_DRAFT)
        p = self.check(d, "reel", sources=[sources])
        v = verdict(p)
        self.assertEqual(v["status"], "fail")
        self.assertEqual(p.returncode, 1)
        self.assertTrue(any("overlap" in e for e in v["hard_errors"]))

    def test_single_quote_span_is_allowed(self):
        sources = self.tmp / "external.md"
        sources.write_text(EXTERNAL)
        md = self.write("sources.md", self.SOURCES_MD)
        quoted = (
            'Honest note: "the one mistake everyone makes when landing" '
            "is worth quoting once.\n\n"
            "Save this and send it to your travel buddy.\n"
            "TravelFrame — your local friend in Hanoi\n\n"
            "#hanoi #vietnamtravel #vietnamtips #travelframe\n"
        )
        d = self.write("quoted.md", quoted)
        p = self.check(d, "reel", sources_md=md, knowledge=self.knowledge(),
                       sources=[sources])
        v = verdict(p)
        self.assertEqual(v["status"], "pass", v)
        self.assertEqual(v["checks"]["overlap"]["quoted_spans"], 1)

    def test_two_quote_spans_fail(self):
        sources = self.tmp / "external.md"
        sources.write_text(EXTERNAL)
        md = self.write("sources.md", self.SOURCES_MD)
        body = (
            'Note one: "the one mistake everyone makes when landing" here.\n'
            'Note two: "the one mistake everyone makes when landing" again.\n'
            "TravelFrame — your local friend in Hanoi\n"
            "#hanoi #vietnamtravel #vietnamtips #travelframe\n"
        )
        d = self.write("twoq.md", body)
        p = self.check(d, "reel", sources_md=md, knowledge=self.knowledge(),
                       sources=[sources])
        v = verdict(p)
        self.assertEqual(v["status"], "fail")
        self.assertTrue(any("quoted span" in e for e in v["hard_errors"]))


class CarouselTests(CheckDraftBase):
    def write_carousel(self, n=5, price_line=None, verify=False):
        lines = []
        for i in range(1, n + 1):
            lines.append(f"## Slide {i} — Slide {i} title")
            lines.append("Some short supporting copy for the slide.")
            if i == 2 and price_line:
                lines.append(price_line)
        return "\n".join(lines)

    def test_five_slides_ok(self):
        md = self.write("sources.md", self.SOURCES_MD)
        d = self.write("c5.md", self.write_carousel(5))
        p = self.check(d, "carousel", sources_md=md, knowledge=self.knowledge())
        v = verdict(p)
        self.assertEqual(v["status"], "pass", v["flags"])

    def test_four_slides_flag(self):
        md = self.write("sources.md", self.SOURCES_MD)
        d = self.write("c4.md", self.write_carousel(4))
        v = verdict(self.check(d, "carousel", sources_md=md, knowledge=self.knowledge()))
        self.assertTrue(any("5-7" in f for f in v["flags"]))

    def test_price_without_verify_flags(self):
        md = self.write("sources.md", self.SOURCES_MD)
        d = self.write("cp.md", self.write_carousel(5, price_line="Egg coffee is $2 here."))
        v = verdict(self.check(d, "carousel", sources_md=md, knowledge=self.knowledge()))
        self.assertTrue(any("price" in f.lower() for f in v["flags"]))

    def test_price_with_verify_is_flagged_not_fail(self):
        md = self.write("sources.md", self.SOURCES_MD)
        d = self.write("cv.md", self.write_carousel(5,
                       price_line="Egg coffee is $2 [VERIFY] here."))
        p = self.check(d, "carousel", sources_md=md, knowledge=self.knowledge())
        v = verdict(p)
        self.assertEqual(v["status"], "flagged")
        self.assertEqual(v["checks"]["verify_count"], 1)
        self.assertEqual(p.returncode, 0)

    def test_price_with_indicative_ok(self):
        md = self.write("sources.md", self.SOURCES_MD)
        d = self.write("ci.md", self.write_carousel(5,
                       price_line="Around $6-8 total (Indicative range)."))
        v = verdict(self.check(d, "carousel", sources_md=md, knowledge=self.knowledge()))
        self.assertFalse(any("price" in f.lower() for f in v["flags"]))


class VideoTests(CheckDraftBase):
    def write_asset_plan(self, train_street=False, safety=True):
        text = ("## Shared direction\n- Voice: warm local friend.\n"
                "- TravelFrame — your local friend in Hanoi\n")
        if train_street:
            text += "## Video: Train Street beat\nPassing train moment from distance.\n"
            if safety:
                text += "Follow the barriers and never step on the tracks.\n"
        return text

    def test_video_package_pass(self):
        md = self.write("sources.md", self.SOURCES_MD)
        plan = self.write("asset-plan.md", self.write_asset_plan())
        script = self.write("narration.txt", "First beat text here.\n\nFinal beat text here.")
        p = self.check(plan, "video", script=script, sources_md=md,
                       knowledge=self.knowledge())
        v = verdict(p)
        self.assertEqual(v["status"], "pass", v["flags"])

    def test_train_street_without_safety_flags(self):
        md = self.write("sources.md", self.SOURCES_MD)
        plan = self.write("ap2.md", self.write_asset_plan(train_street=True, safety=False))
        script = self.write("n2.txt", "beat")
        v = verdict(self.check(plan, "video", script=script, sources_md=md,
                               knowledge=self.knowledge()))
        self.assertTrue(any("Train Street" in f for f in v["flags"]))

    def test_empty_script_flags(self):
        md = self.write("sources.md", self.SOURCES_MD)
        plan = self.write("ap3.md", self.write_asset_plan())
        script = self.write("empty.txt", "")
        v = verdict(self.check(plan, "video", script=script, sources_md=md,
                               knowledge=self.knowledge()))
        self.assertTrue(any("narration" in f for f in v["flags"]))


class TraceabilityTests(CheckDraftBase):
    def test_unknown_entry_id_is_hard_fail(self):
        md = self.write("sources.md", "## Patterns used\n- P-999\n")
        d = self.write("r.md", REEL_GOOD)
        v = verdict(self.check(d, "reel", sources_md=md, knowledge=self.knowledge()))
        self.assertEqual(v["status"], "fail")
        self.assertTrue(any("unknown entry" in e for e in v["hard_errors"]))

    def test_duplicate_ids_in_knowledge_fail(self):
        kdir = self.knowledge()
        (kdir / "ideas-backlog.md").write_text(
            "## I-001 | duplicate name   (confidence: 1 nguồn)\n"
            "- Nguồn: Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (2026-09-11)\n\n"
            "## I-001 | duplicate again   (confidence: 1 nguồn)\n"
            "- Nguồn: Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (2026-09-11)\n",
            encoding="utf-8")
        md = self.write("sources.md", self.SOURCES_MD)
        d = self.write("r2.md", REEL_GOOD)
        v = verdict(self.check(d, "reel", sources_md=md, knowledge=kdir))
        self.assertEqual(v["status"], "fail")
        self.assertTrue(any("duplicate entry IDs" in e for e in v["hard_errors"]))


if __name__ == "__main__":
    unittest.main()


class ScriptFileTests(CheckDraftBase):
    def test_script_without_hashtag_allowed_via_flag(self):
        """Narration files: sign-off + CTA required, hashtag not."""
        body = ("## Hook (0-3s)\nLanding with no data?\n\n## Beats\nOne beat here.\n\n"
                "## CTA\nComment SIM and we will DM the steps.\n"
                "TravelFrame — your local friend in Hanoi\n")
        d = self.write("script.md", body)
        md = self.write("sources.md", self.SOURCES_MD)
        v = verdict(self.check(d, "reel", no_expect_hashtag=True, sources_md=md,
                               knowledge=self.knowledge()))
        self.assertEqual(v["status"], "pass", v["flags"])

    def test_verify_count_drives_flagged_status(self):
        body = REEL_GOOD + " Coffee costs around $2 [VERIFY] nearby.\n"
        d = self.write("v.md", body)
        v = verdict(self.check(d, "reel"))
        self.assertEqual(v["status"], "flagged")
        self.assertEqual(v["checks"]["verify_count"], 1)
