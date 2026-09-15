#!/usr/bin/env python3
"""apify_scrape.py — run one Apify actor and save its dataset items as JSON.

Usage:
  apify_scrape.py --actor apify/instagram-profile-scraper \
                  --input '{"usernames":["handle"],"resultsType":"posts","resultsLimit":30}' \
                  --out reference-library/channels/handle/posts.json \
                  [--timeout 240] [--token ...]

Token resolution order: --token flag > APIFY_TOKEN env > .env in project root.
Stdlib only — no pip dependencies.
"""
import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request

API = "https://api.apify.com/v2"


def resolve_token(cli_token: str | None) -> str:
    if cli_token:
        return cli_token.strip()
    env = os.environ.get("APIFY_TOKEN")
    if env:
        return env.strip()
    script = os.path.abspath(__file__)
    root = script
    for _ in range(5):
        root = os.path.dirname(root)
    env_file = os.path.join(root, ".env")
    if os.path.exists(env_file):
        for line in open(env_file, encoding="utf-8"):
            if line.strip().startswith("APIFY_TOKEN="):
                value = line.split("=", 1)[1].strip()
                if value:
                    return value
    sys.exit("ERROR: no Apify token. Set APIFY_TOKEN in .env or pass --token.")


def http(url: str, method: str = "GET", payload: dict | None = None, timeout: int = 60):
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=json.dumps(payload).encode() if payload is not None else None,
                                 headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:2000]
        sys.exit(f"Apify API error {e.code} on {method} {url.split('?')[0]}:\n{body}")
    except Exception as e:
        return None, {"error": str(e)}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--actor", required=True, help="actor id, e.g. apify/instagram-profile-scraper")
    p.add_argument("--input", required=True, help="actor input as JSON string")
    p.add_argument("--out", required=True, help="output .json path for dataset items")
    p.add_argument("--timeout", type=int, default=240, help="max seconds to wait for the run")
    p.add_argument("--token", default=None)
    a = p.parse_args()

    token = resolve_token(a.token)
    # Apify API dùng dạng "username~actor-name" trong URL; chấp nhận cả "username/name"
    actor = urllib.parse.quote(a.actor.replace("/", "~", 1) if "~" not in a.actor else a.actor)  # keep the username/name slash
    run_input = json.loads(a.input)

    # 1) fast path: sync run returning dataset items (waits up to ~300s server-side)
    url = f"{API}/acts/{actor}/run-sync-get-dataset-items?token={token}&timeout={a.timeout}"
    status, body = http(url, method="POST", payload=run_input, timeout=a.timeout + 30)
    if status == 200 and isinstance(body, list):
        _save(a.out, body)
        print(f"OK sync: {len(body)} items -> {a.out}")
        return

    # 2) fallback: async run + poll
    print(f"Sync path not immediate (status={status}); falling back to async run…", file=sys.stderr)
    status, run = http(f"{API}/acts/{actor}/runs?token={token}", "POST", run_input)
    if status != 201:
        sys.exit(f"Could not start actor run: {json.dumps(run)[:1000]}")
    run_id = run["data"]["id"]
    deadline = time.time() + a.timeout
    while time.time() < deadline:
        status, run = http(f"{API}/actor-runs/{run_id}?token={token}")
        if status == 200:
            s = run["data"]["status"]
            if s in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
                if s != "SUCCEEDED":
                    sys.exit(f"Run {run_id} ended with status {s}: {json.dumps(run)[:1000]}")
                break
        time.sleep(5)
    else:
        sys.exit(f"Run {run_id} still not finished after {a.timeout}s. Check https://console.apify.com/actors/runs/{run_id}")

    items = []
    offset = 0
    limit = 500
    while True:
        status, page = http(f"{API}/datasets/{run['data']['defaultDatasetId']}/items"
                            f"?token={token}&offset={offset}&limit={limit}&clean=true")
        if status != 200:
            sys.exit(f"Could not read dataset: {json.dumps(page)[:1000]}")
        batch = page if isinstance(page, list) else page.get("data", [])
        items.extend(batch)
        if len(batch) < limit:
            break
        offset += limit
    _save(a.out, items)
    print(f"OK async: {len(items)} items -> {a.out}")


def _save(out: str, items: list):
    os.makedirs(os.path.dirname(os.path.abspath(out)) or ".", exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
