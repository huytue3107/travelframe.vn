"""Generate Hanoi Handbook illustrations on KIE (nano-banana-2).

Reads prompts.json, submits one task per image, polls until done, downloads
results next to prompts.json and writes manifest.json (prompt, taskId,
credits). The API key is read from KIE_API_KEY and never printed.

Usage:
  python3 -I generate_illustrations.py <prompts.json> [id ...]
Only the given ids are (re)generated when ids are passed.
"""
import json
import os
import sys
import time
import urllib.request

API = "https://api.kie.ai/api/v1"
KEY = os.environ.get("KIE_API_KEY", "")


def call(method, path, body=None):
    req = urllib.request.Request(
        API + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def main():
    if not KEY:
        sys.exit("KIE_API_KEY is not set")
    prompts_path = os.path.abspath(sys.argv[1])
    only = set(sys.argv[2:])
    out_dir = os.path.dirname(prompts_path)
    spec = json.load(open(prompts_path))
    manifest_path = os.path.join(out_dir, "manifest.json")
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {
        "project": spec["project"], "model": spec["model"], "style": spec["style"], "images": {}}

    jobs = [im for im in spec["images"] if not only or im["id"] in only]
    tasks = {}
    for im in jobs:
        body = {"model": spec["model"], "input": {
            "prompt": spec["style"] + "\n\nScene: " + im["prompt"],
            "aspect_ratio": im["aspect_ratio"],
            "resolution": im["resolution"],
            "output_format": "png"}}
        res = call("POST", "/jobs/createTask", body)
        if res.get("code") != 200:
            print(f"[{im['id']}] submit failed: {res.get('code')} {res.get('msg')}", flush=True)
            continue
        tasks[im["id"]] = (im, res["data"]["taskId"])
        print(f"[{im['id']}] submitted", flush=True)
        time.sleep(0.6)

    pending = dict(tasks)
    deadline = time.time() + 900
    while pending and time.time() < deadline:
        time.sleep(4)
        for iid, (im, tid) in list(pending.items()):
            try:
                res = call("GET", f"/jobs/recordInfo?taskId={tid}")
            except Exception as e:  # transient network error: retry next round
                print(f"[{iid}] poll error {e}", flush=True)
                continue
            if res.get("code") != 200:
                print(f"[{iid}] poll code {res.get('code')} {res.get('msg')}", flush=True)
                continue
            d = res["data"]
            if d["state"] == "success":
                url = (d.get("response") or {}).get("resultUrls", [None])[0]
                dest = os.path.join(out_dir, f"{iid}.png")
                urllib.request.urlretrieve(url, dest)
                manifest["images"][iid] = {
                    "file": f"{iid}.png", "taskId": tid, "aspect_ratio": im["aspect_ratio"],
                    "resolution": im["resolution"], "prompt": im["prompt"],
                    "credits": d.get("creditsConsumed"),
                    "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z")}
                print(f"[{iid}] done ({d.get('creditsConsumed')} credits)", flush=True)
                del pending[iid]
            elif d["state"] == "fail":
                print(f"[{iid}] FAILED: {d.get('failCode')} {d.get('failMsg')}", flush=True)
                del pending[iid]
        json.dump(manifest, open(manifest_path, "w"), indent=2, ensure_ascii=False)
    for iid in pending:
        print(f"[{iid}] timed out", flush=True)
    total = sum((v.get("credits") or 0) for v in manifest["images"].values())
    print(f"images in manifest: {len(manifest['images'])}, credits recorded: {total}", flush=True)


if __name__ == "__main__":
    main()
