"""channel_metrics.py tests — deterministic fixtures with hand-computed values."""
import json
import tempfile
import unittest
from pathlib import Path

from helpers import load, run_metrics


def make_posts(n=12, followers=100, base_like=100, pinned_idx=None,
               with_views=True, missing_followers=False):
    posts = []
    for i in range(n):
        likes = base_like + (i * 10)
        posts.append({
            "id": f"id{i}", "shortCode": f"sc{i}", "url": f"https://x/p/{i}",
            "type": "Video" if i % 3 == 0 else ("Image" if i % 3 == 1 else "Sidecar"),
            "timestamp": f"2026-08-{(i % 28) + 1:02d}T12:00:00.000Z",
            "likesCount": likes, "commentsCount": 10,
            "isPinned": (i == pinned_idx), "isCommentsDisabled": False,
            "caption": f"caption {i} with #tag{i}", "hashtags": [f"tag{i}"],
            "mentions": [], "childPosts": [] if i % 3 != 2 else [
                {"id": f"c{j}", "likesCount": 5} for j in range(2)],
            **({} if i % 3 != 0 else {"videoViewCount": 1000 + i}),
        })
    profile = {"username": "testchan", "latestPosts": posts}
    if not missing_followers:
        profile["followersCount"] = followers
    return [profile]


class MetricsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="cm-"))

    def metrics(self, data, now="2026-09-12T00:00:00Z"):
        src = self.tmp / "posts.json"
        src.write_text(json.dumps(data), encoding="utf-8")
        out = self.tmp / "out"
        r = run_metrics("--posts", src, "--out", out, "--now", now)
        return r, load(out / "metrics.json")

    def test_exact_er_and_median(self):
        r, m = self.metrics(make_posts())
        self.assertEqual(r.returncode, 0, r.stderr)
        # followers=100, likes+comments per post = e.g. 100+10=110 → ER 1.1
        row = next(x for x in m["rows"] if x["shortCode"] == "sc0")
        self.assertEqual(row["engagement"], 110)
        self.assertEqual(row["er"], round(110 / 100, 6))
        # median ER across 12 posts: values are (100+10*i+10)/100
        expected_meds = sorted((100 + 10 * i + 10) / 100 for i in range(12))
        med = (expected_meds[5] + expected_meds[6]) / 2
        self.assertEqual(m["stats"]["median_er"], round(med, 6))

    def test_pinned_excluded_from_without_pinned_median(self):
        r, m = self.metrics(make_posts(pinned_idx=0))
        self.assertEqual(m["stats"]["n_pinned"], 1)
        self.assertGreaterEqual(m["stats"]["median_er_without_pinned"], 0)

    def test_views_only_for_video(self):
        r, m = self.metrics(make_posts())
        video_rows = [x for x in m["rows"] if x["type"] == "Video"]
        image_rows = [x for x in m["rows"] if x["type"] == "Image"]
        self.assertTrue(all(x["views"] is not None for x in video_rows))
        self.assertTrue(all(x["views"] is None for x in image_rows))
        self.assertIsNotNone(m["stats"]["median_views_video"])

    def test_sidecar_child_posts_recorded(self):
        r, m = self.metrics(make_posts())
        side = [x for x in m["rows"] if x["type"] == "Sidecar"]
        self.assertTrue(all(x["child_posts"] == 2 for x in side))

    def test_missing_followers_nulls_er_and_flags(self):
        r, m = self.metrics(make_posts(missing_followers=True))
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIsNone(m["stats"]["followers_used"])
        self.assertIsNone(m["rows"][0]["er"])
        self.assertTrue(any("followers missing" in f for f in m["stats"]["flags"]))

    def test_small_sample_flag(self):
        r, m = self.metrics(make_posts(n=5))
        self.assertTrue(any("small sample" in f for f in m["stats"]["flags"]))

    def test_flat_shape_works(self):
        flat = make_posts()[0]["latestPosts"]
        r, m = self.metrics(flat)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(m["stats"]["n_posts"], 12)
        self.assertEqual(m["stats"]["followers_used"], None)  # flat has no profile
        self.assertIsNone(m["rows"][0]["er"])

    def test_strange_fields_do_not_crash(self):
        data = make_posts(n=2)
        data[0]["latestPosts"][0]["weirdField"] = {"x": 1}
        r, m = self.metrics(data)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(m["stats"]["n_posts"], 2)

    def test_cadence_exact(self):
        # 4 posts, 7 days apart → span 21d, 7 posts/week, median gap 7
        posts = [{"shortCode": f"g{i}", "timestamp":
                  f"2026-08-{1 + i * 7:02d}T12:00:00.000Z",
                  "likesCount": 10, "commentsCount": 0} for i in range(4)]
        r, m = self.metrics([{"username": "c", "followersCount": 10,
                              "latestPosts": posts}])
        self.assertEqual(m["stats"]["cadence"]["span_days"], 21.0)
        self.assertEqual(m["stats"]["cadence"]["median_gap_days"], 7)
        self.assertAlmostEqual(m["stats"]["cadence"]["posts_per_week"],
                               round(4 / 21 * 7, 2))

    def test_overwrite_refusal(self):
        src = self.tmp / "p.json"
        src.write_text(json.dumps(make_posts(n=2)), encoding="utf-8")
        out = self.tmp / "out"
        self.assertEqual(run_metrics("--posts", src, "--out", out).returncode, 0)
        r2 = run_metrics("--posts", src, "--out", out)
        self.assertNotEqual(r2.returncode, 0)
        self.assertIn("refusing", r2.stderr)

    def test_refuses_missing_file(self):
        r = run_metrics("--posts", "/nope/nope.json", "--out", self.tmp / "o")
        self.assertNotEqual(r.returncode, 0)


if __name__ == "__main__":
    unittest.main()
