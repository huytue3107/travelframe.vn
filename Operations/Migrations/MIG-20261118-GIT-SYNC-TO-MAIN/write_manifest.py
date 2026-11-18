#!/usr/bin/env python3
"""Write manifest.tsv and excluded.tsv for MIG-20261118-GIT-SYNC-TO-MAIN from /tmp/mig-sync/build.json."""
import hashlib
import json
import os
import subprocess

REPO = os.path.expanduser("~/Codex GPT/travelframe.vn")
DIR = os.path.join(REPO, "Operations/Migrations/MIG-20261118-GIT-SYNC-TO-MAIN")
OUT = "/tmp/mig-sync"
import importlib.util
spec = importlib.util.spec_from_file_location("s", os.path.join(DIR, "sync_to_main.py"))
s = importlib.util.module_from_spec(spec)
spec.loader.exec_module(s)


def git(*a, env=None):
    e = dict(os.environ)
    e.update(env or {})
    return subprocess.run(["git", *a], cwd=REPO, env=e, capture_output=True, check=True).stdout.decode()


def sha256(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


b = json.load(open(os.path.join(OUT, "build.json")))
with open(os.path.join(DIR, "manifest.tsv"), "w") as f:
    f.write("kind\told_sha\tnew_sha\tfiles\tsubject\n")
    for m in b["map"]:
        subj = git("log", "-1", "--format=%s", m["old"]).strip()
        f.write(f"replay\t{m['old']}\t{m['new'] or '-'}\t\t{subj}\n")
    for x in b["batches"]:
        f.write(f"batch {x['batch']}\t-\t{x['new'] or '-'}\t{x['files']}\t{x.get('subject', '')}\n")

rows = {}
for e in b["excluded"]:
    rows[e["path"]] = ("commit " + e["commit"] if e["commit"] != "worktree" else "worktree", e["reason"])
ignored = git("ls-files", "--others", "--ignored", "--exclude-standard",
              env={"GIT_INDEX_FILE": os.path.join(OUT, "index")}).splitlines()
for p in ignored:
    if p.startswith(("Technology-Automation/Tools/", "tmp/")) or "node_modules/" in p:
        continue
    full = os.path.join(REPO, p)
    why = s.excluded(p, os.path.getsize(full) if os.path.isfile(full) else 0)
    if why and p not in rows:
        rows[p] = ("worktree (untracked)", why)

n_exist = total = 0
with open(os.path.join(DIR, "excluded.tsv"), "w") as f:
    f.write("path\tsource\treason\tbytes\ton_disk\tsha256\n")
    for p in sorted(rows):
        src, why = rows[p]
        full = os.path.join(REPO, p)
        if os.path.isfile(full) and not os.path.islink(full):
            size = os.path.getsize(full)
            n_exist += 1
            total += size
            f.write(f"{p}\t{src}\t{why}\t{size}\tyes\t{sha256(full)}\n")
        else:
            f.write(f"{p}\t{src}\t{why}\t\tno\t\n")
print(json.dumps({"excluded_rows": len(rows), "on_disk": n_exist, "on_disk_MB": round(total / 1e6, 1)}))
