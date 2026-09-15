"""merge_scores.py tests — adversarial merge contract."""
import json
import tempfile
import unittest
from pathlib import Path

from helpers import load, run_merge


def score(post_id, url, **crits):
    return {"post_id": post_id, "url": url,
            "scores": {k: {"score": v, "evidence": f"ev {k}"} for k, v in crits.items()}}


FULL_A = dict(hook=2, structure=1, cta=1, caption=2, production=1)
FULL_B = dict(hook=1, structure=1, cta=1, caption=2, production=1)
DIVERGE_B = dict(hook=0, structure=1, cta=1, caption=2, production=1)


def doc(posts):
    return {"rater": "R", "posts": posts}


class MergeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="ms-"))

    def merge(self, a, b, name="scores.json"):
        fa = self.tmp / "a.json"
        fb = self.tmp / "b.json"
        fa.write_text(json.dumps(doc(a)), encoding="utf-8")
        fb.write_text(json.dumps(doc(b)), encoding="utf-8")
        out = self.tmp / name
        r = run_merge("--a", fa, "--b", fb, "--out", out)
        return r, (load(out) if out.exists() else None)

    def test_agreement_resolves_mean(self):
        r, m = self.merge([score("p1", "u", **FULL_A)], [score("p1", "u", **FULL_B)])
        self.assertEqual(r.returncode, 0, r.stderr)
        p = m["posts"][0]
        self.assertEqual(p["status"], "resolved")
        self.assertEqual(p["scores"]["hook"]["status"], "resolved")
        self.assertEqual(p["scores"]["hook"]["final"], 2)  # mean(2,1)=1.5 → round half up 2
        self.assertEqual(p["total"], 7)

    def test_divergence_over_1_unresolved(self):
        r, m = self.merge([score("p1", "u", **FULL_A)], [score("p1", "u", **DIVERGE_B)])
        p = m["posts"][0]
        self.assertEqual(p["status"], "unresolved")
        self.assertEqual(p["scores"]["hook"]["status"], "unresolved")
        self.assertIsNone(p["scores"]["hook"]["final"])
        self.assertEqual(p["scores"]["hook"]["a"]["score"], 2)
        self.assertEqual(p["scores"]["hook"]["b"]["score"], 0)
        self.assertEqual(p["scores"]["cta"]["status"], "resolved")

    def test_zero_delta_resolves(self):
        r, m = self.merge([score("p1", "u", cta=1)], [score("p1", "u", cta=1)])
        self.assertEqual(m["posts"][0]["scores"]["cta"]["final"], 1)

    def test_missing_evidence_unresolved(self):
        a = score("p1", "u", hook=2)
        a["scores"]["hook"]["evidence"] = None
        b = score("p1", "u", hook=2)
        r, m = self.merge([a], [b])
        p = m["posts"][0]
        self.assertEqual(p["scores"]["hook"]["status"], "unresolved")
        self.assertEqual(m["summary"]["missing_evidence"], 1)

    def test_post_missing_in_one_rater(self):
        r, m = self.merge([score("p1", "u", **FULL_A)], [score("p9", "u", **FULL_B)])
        self.assertEqual(m["summary"]["criteria_unresolved"], 2)  # p1 + p9 unmatched
        self.assertEqual(m["posts"][0]["status"], "unresolved")

    def test_no_evidence_reported_and_scores_kept(self):
        a = score("p1", "u", **FULL_A)
        b = score("p1", "u", **FULL_B)
        b["scores"]["hook"]["evidence"] = ""
        r, m = self.merge([a], [b])
        p = m["posts"][0]
        self.assertEqual(p["scores"]["hook"]["status"], "unresolved")
        self.assertEqual(p["scores"]["hook"]["a"]["score"], 2)  # ratings kept

    def test_invalid_file_errors(self):
        fa = self.tmp / "bad.json"
        fa.write_text(json.dumps({"nope": 1}), encoding="utf-8")
        r = run_merge("--a", fa, "--b", self.tmp / "b.json", "--out", self.tmp / "o.json")
        self.assertNotEqual(r.returncode, 0)

    def test_overwrite_refusal(self):
        a = [score("p1", "u", **FULL_A)]
        b = [score("p1", "u", **FULL_B)]
        r1, _ = self.merge(a, b, name="s.json")
        self.assertEqual(r1.returncode, 0)
        r2, _ = self.merge(a, b, name="s.json")
        self.assertNotEqual(r2.returncode, 0)
        self.assertIn("refusing", r2.stderr)


if __name__ == "__main__":
    unittest.main()
