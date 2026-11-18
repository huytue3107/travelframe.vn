#!/usr/bin/env python3
"""MIG-20261118-GIT-SYNC-TO-MAIN

Move the unpushable local branch (heavy media in history) onto origin/main without media,
then commit the uncommitted working tree in department batches.

Never touches working-tree files except .gitignore (batch 0). Builds commits with a
temporary index (plumbing). Phases:
  plan     classify only; writes /tmp/mig-sync/plan.json
  build    create objects + commits; writes /tmp/mig-sync/build.json (no ref changes)
  validate check build tip against the working tree and limits
Ref updates, push and index reset are separate, explicit shell steps (see README).
"""
import json
import os
import subprocess
import sys
from collections import Counter, OrderedDict

REPO = os.path.expanduser("~/Codex GPT/travelframe.vn")
OUT = "/tmp/mig-sync"
TMP_INDEX = os.path.join(OUT, "index")
BASE_REF = "origin/main"
MIG = "MIG-20261118-GIT-SYNC-TO-MAIN"
MAX_BYTES = 50 * 1000 * 1000
AV_EXT = {"mp4", "mov", "webm", "mp3", "wav", "m4a"}
IMG_EXT = {"png", "jpg", "jpeg", "webp"}

GITIGNORE_BLOCK = """
# MIG-20261118-GIT-SYNC-TO-MAIN: render output and heavy media stay outside git (Rocky 2026-11-18)
tmp/
node_modules/
**/.hyperframes/preview/
Creative-Production/Projects/**/*.png
Creative-Production/Projects/**/*.jpg
Creative-Production/Projects/**/*.jpeg
Creative-Production/Projects/**/*.webp
*.mp4
*.mov
*.webm
*.mp3
*.wav
*.m4a
"""

BATCHES = OrderedDict([
    ("B0", ("chore(workspace): keep render output and heavy media outside git", [".gitignore"])),
    ("B1", ("docs(executive): sync operating state, decisions and agent policy",
            ["Executive/", "Brand-Strategy/", "AGENTS.md", "README.md", "CLAUDE.md"])),
    ("B2", ("feat(automation): add local automation scripts, handoffs and dashboard server",
            ["Technology-Automation/", "package.json"])),
    ("B3", ("docs(operations): record the TravelFrame vault rename migration", ["Operations/"])),
    ("B4", ("docs(seo): add SEO audits, keyword clusters and backlink kit", ["Marketing-Growth/SEO/"])),
    ("B5", ("docs(marketing): sync content drafts, plans and interaction logs", ["Marketing-Growth/"])),
    ("B6", ("docs(sales): add funnel review, follow-up scripts, outreach and thank-you email",
            ["Sales-CRM/"])),
    ("B7", ("docs(data): sync trackers, dashboards, reports and snapshots", ["Data-Analytics/"])),
    ("B8", ("docs(research): sync research library and competitive notes", ["Research-Insights/"])),
    ("B9", ("docs(creative): add project scripts, manifests and asset metadata (no renders)",
            ["Creative-Production/"])),
])

TRAILER = (
    "\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n"
    "Claude-Session: https://claude.ai/code/session_017tXp6kiPXLevpbnv1zDMbp\n"
)


def git(*args, env=None, inp=None, check=True):
    e = dict(os.environ)
    if env:
        e.update(env)
    r = subprocess.run(["git", *args], cwd=REPO, env=e, input=inp, capture_output=True)
    if check and r.returncode != 0:
        sys.exit(f"git {' '.join(args[:3])} failed: {r.stderr.decode(errors='replace')[:400]}")
    return r.stdout


def ext(p):
    name = p.rsplit("/", 1)[-1]
    return name.rsplit(".", 1)[-1].lower() if "." in name else ""


def excluded(p, size=0):
    e = ext(p)
    if e in AV_EXT:
        return "audio/video"
    if p.startswith("Creative-Production/Projects/") and e in IMG_EXT:
        return "project render image"
    if "/.hyperframes/preview/" in p:
        return "hyperframes preview"
    if p.startswith("tmp/") or "/node_modules/" in p or p.startswith("node_modules/"):
        return "tmp/node_modules"
    if size > MAX_BYTES:
        return "over 50 MB"
    return None


def blob_size(sha):
    return int(git("cat-file", "-s", sha).strip())


def batch_of(p):
    for bid, (_, prefixes) in BATCHES.items():
        if bid == "B0":
            if p == ".gitignore":
                return bid
            continue
        for pre in prefixes:
            if p == pre or (pre.endswith("/") and p.startswith(pre)):
                return bid
    return None


def local_commits():
    mb = git("merge-base", "HEAD", BASE_REF).decode().strip()
    revs = git("rev-list", "--reverse", "--parents", f"{mb}..HEAD").decode().split("\n")
    out = []
    for line in revs:
        if not line.strip():
            continue
        parts = line.split()
        if len(parts) != 2:
            sys.exit(f"merge commit found ({parts[0]}); stop")
        out.append((parts[0], parts[1]))
    return mb, out


def commit_changes(c, parent):
    raw = git("diff-tree", "-r", "--no-renames", "-z", parent, c).decode(errors="surrogateescape")
    items = raw.split("\0")
    res = []
    i = 0
    while i < len(items) - 1:
        meta = items[i].lstrip(":").split()
        path = items[i + 1]
        i += 2
        mode_new, sha_new, status = meta[1], meta[3], meta[4]
        res.append((status, mode_new, sha_new, path))
    return res


def worktree_changes():
    raw = git("status", "--porcelain=v1", "-z", "-uall").decode(errors="surrogateescape")
    res = []
    items = raw.split("\0")
    i = 0
    while i < len(items):
        it = items[i]
        i += 1
        if not it:
            continue
        xy, path = it[:2], it[3:]
        if xy[0] in "RC":
            i += 1  # skip rename source
        res.append((xy, path))
    return res


def plan():
    os.makedirs(OUT, exist_ok=True)
    mb, commits = local_commits()
    report = {"merge_base": mb, "base": git("rev-parse", BASE_REF).decode().strip(),
              "old_head": git("rev-parse", "HEAD").decode().strip(), "commits": [], "worktree": {}}
    ex_total = Counter()
    for c, parent in commits:
        kept = skipped = 0
        for status, mode, sha, path in commit_changes(c, parent):
            size = blob_size(sha) if status != "D" else 0
            why = excluded(path, size)
            if why:
                skipped += 1
                ex_total[why] += 1
            else:
                kept += 1
        subj = git("log", "-1", "--format=%s", c).decode().strip()
        report["commits"].append({"sha": c, "subject": subj, "kept": kept, "excluded": skipped})
    wt = Counter()
    unknown = []
    for xy, path in worktree_changes():
        full = os.path.join(REPO, path)
        size = os.path.getsize(full) if os.path.isfile(full) else 0
        why = excluded(path, size)
        if why:
            wt["excluded:" + why] += 1
            continue
        b = batch_of(path)
        if not b:
            unknown.append(path)
        wt[b or "UNKNOWN"] += 1
    report["excluded_in_commits"] = dict(ex_total)
    report["worktree"] = dict(wt)
    report["unknown"] = unknown
    json.dump(report, open(os.path.join(OUT, "plan.json"), "w"), indent=1)
    print(json.dumps({k: v for k, v in report.items() if k != "commits"}, indent=1))
    print("commits:", len(report["commits"]), "kept files:", sum(x["kept"] for x in report["commits"]))


def index_env():
    return {"GIT_INDEX_FILE": TMP_INDEX}


def apply_index_info(lines):
    if lines:
        git("update-index", "--index-info", env=index_env(), inp=("\n".join(lines) + "\n").encode())


def build():
    os.makedirs(OUT, exist_ok=True)
    if os.path.exists(TMP_INDEX):
        os.remove(TMP_INDEX)
    mb, commits = local_commits()
    base = git("rev-parse", BASE_REF).decode().strip()
    git("read-tree", base, env=index_env())
    tip = base
    log = {"base": base, "old_head": git("rev-parse", "HEAD").decode().strip(), "map": [], "batches": [],
           "excluded": []}
    zero = "0" * 40
    for c, parent in commits:
        lines = []
        for status, mode, sha, path in commit_changes(c, parent):
            size = blob_size(sha) if status != "D" else 0
            why = excluded(path, size)
            if why:
                log["excluded"].append({"commit": c[:7], "path": path, "status": status, "bytes": size,
                                        "reason": why})
                continue
            if status == "D":
                lines.append(f"0 {zero}\t{path}")
            else:
                lines.append(f"{mode} {sha}\t{path}")
        apply_index_info(lines)
        tree = git("write-tree", env=index_env()).decode().strip()
        prev_tree = git("rev-parse", f"{tip}^{{tree}}").decode().strip()
        if tree == prev_tree:
            log["map"].append({"old": c, "new": None, "note": "only excluded media"})
            continue
        fmt = git("log", "-1", "--format=%an%x00%ae%x00%aI%x00%B", c).decode()
        an, ae, ad, body = fmt.split("\0", 3)
        msg = body.rstrip() + f"\n\nMigrated-From: {c} ({MIG}; media excluded)\n"
        new = git("commit-tree", tree, "-p", tip, env={"GIT_AUTHOR_NAME": an, "GIT_AUTHOR_EMAIL": ae,
                                                        "GIT_AUTHOR_DATE": ad}, inp=msg.encode()).decode().strip()
        log["map"].append({"old": c, "new": new})
        tip = new

    # Batch 0 needs the .gitignore change in the working tree too.
    gi = os.path.join(REPO, ".gitignore")
    text = open(gi, encoding="utf-8").read()
    if MIG not in text:
        with open(gi, "a", encoding="utf-8") as f:
            f.write(GITIGNORE_BLOCK)

    changes = worktree_changes()
    by_batch = {b: [] for b in BATCHES}
    for xy, path in changes:
        full = os.path.join(REPO, path)
        size = os.path.getsize(full) if os.path.isfile(full) else 0
        why = excluded(path, size)
        if why:
            log["excluded"].append({"commit": "worktree", "path": path, "status": xy.strip(), "bytes": size,
                                    "reason": why})
            continue
        b = batch_of(path)
        if not b:
            sys.exit(f"unclassified path: {path}")
        by_batch[b].append((xy, path))

    for bid, (subject, _) in BATCHES.items():
        items = by_batch[bid]
        lines = []
        paths_to_hash = [p for xy, p in items
                         if os.path.isfile(os.path.join(REPO, p)) and not os.path.islink(os.path.join(REPO, p))]
        shas = {}
        if paths_to_hash:
            out = git("hash-object", "-w", "--stdin-paths", inp=("\n".join(paths_to_hash) + "\n").encode())
            shas = dict(zip(paths_to_hash, out.decode().split()))
        for xy, p in items:
            full = os.path.join(REPO, p)
            if os.path.islink(full):
                target = os.readlink(full).encode()
                link_sha = git("hash-object", "-w", "--stdin", inp=target).decode().strip()
                lines.append(f"120000 {link_sha}\t{p}")
            elif os.path.isfile(full):
                mode = "100755" if os.access(full, os.X_OK) else "100644"
                lines.append(f"{mode} {shas[p]}\t{p}")
            else:
                lines.append(f"0 {zero}\t{p}")
        apply_index_info(lines)
        tree = git("write-tree", env=index_env()).decode().strip()
        prev_tree = git("rev-parse", f"{tip}^{{tree}}").decode().strip()
        if tree == prev_tree:
            log["batches"].append({"batch": bid, "files": len(items), "new": None})
            continue
        msg = f"{subject}\n\nPart of {MIG}: commit the uncommitted working tree by department.{TRAILER}"
        new = git("commit-tree", tree, "-p", tip, inp=msg.encode()).decode().strip()
        log["batches"].append({"batch": bid, "files": len(items), "new": new, "subject": subject})
        tip = new
    log["tip"] = tip
    json.dump(log, open(os.path.join(OUT, "build.json"), "w"), indent=1)
    print(json.dumps({"tip": tip, "replayed": sum(1 for m in log["map"] if m["new"]),
                      "skipped_commits": sum(1 for m in log["map"] if not m["new"]),
                      "batches": [(b["batch"], b["files"], (b["new"] or "-")[:7]) for b in log["batches"]],
                      "excluded": len(log["excluded"])}))


def validate():
    log = json.load(open(os.path.join(OUT, "build.json")))
    tip = log["tip"]
    git("read-tree", tip, env=index_env())
    git("update-index", "-q", "--refresh", env=index_env(), check=False)
    modified = git("diff-files", "--name-status", env=index_env()).decode().strip().splitlines()
    untracked = git("ls-files", "--others", "--exclude-standard", env=index_env()).decode().strip().splitlines()
    objs = git("rev-list", "--objects", f"{log['base']}..{tip}")
    checked = git("cat-file", "--batch-check=%(objecttype) %(objectsize) %(rest)", inp=objs).decode()
    if not checked.strip():  # some git builds need the format without %(rest) when reading stdin
        names = "\n".join(l.split(" ", 1)[0] for l in objs.decode().splitlines()) + "\n"
        checked = git("cat-file", "--batch-check=%(objecttype) %(objectsize)", inp=names.encode()).decode()
    big, total = [], 0
    for x in checked.splitlines():
        parts = x.split(" ", 2)
        if parts[0] == "blob":
            total += int(parts[1])
            if int(parts[1]) > MAX_BYTES:
                big.append((parts[2] if len(parts) > 2 else "?", int(parts[1])))
    res = {"tip": tip, "worktree_vs_tip_modified": modified, "untracked_not_ignored": untracked,
           "blobs_over_50MB": big, "push_blob_MB": round(total / 1e6, 1)}
    json.dump(res, open(os.path.join(OUT, "validate.json"), "w"), indent=1)
    print(json.dumps({k: (v if not isinstance(v, list) else (len(v), v[:15])) for k, v in res.items()}, indent=1))


if __name__ == "__main__":
    {"plan": plan, "build": build, "validate": validate}[sys.argv[1]]()
