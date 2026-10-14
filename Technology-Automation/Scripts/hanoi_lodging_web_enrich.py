#!/usr/bin/env python3
"""Collect published business contact evidence from individual public websites."""
import concurrent.futures
import gzip
import hashlib
import html
import ipaddress
import json
import re
import subprocess
import threading
import time
import urllib.parse
import urllib.request
from pathlib import Path
from hanoi_lodging_public_collect import plain

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'Research-Insights/Competitive/2026-10-14-hanoi-lodging-partners'
CACHE = OUT / 'raw/web-pages'
FREE = {'gmail.com', 'yahoo.com', 'yahoo.com.vn', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'hn.vnn.vn', 'hcm.vnn.vn', 'vnn.vn', 'fpt.vn', 'viettel.vn'}
EMAIL = re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,63}')
CONTACT = re.compile(r'contact|lien-he|liên-hệ|about|gioi-thieu|tour|experience|concierge', re.I)


def domain(url):
    return (urllib.parse.urlparse(url).hostname or '').lower().removeprefix('www.')


def safe_url(url):
    p = urllib.parse.urlparse(url)
    host = p.hostname or ''
    if p.scheme not in {'http', 'https'} or p.username or p.password or not host or '.' not in host:
        return False
    if re.search(r'(?:token|password|secret|api[_-]?key)=', p.query, re.I):
        return False
    try:
        if not ipaddress.ip_address(host).is_global:
            return False
    except ValueError:
        if host == 'localhost' or host.endswith(('.local', '.internal')):
            return False
    return True


def fetch(url):
    key = hashlib.sha256(url.encode()).hexdigest()[:20]
    cache = CACHE / (key + '.json')
    if cache.exists():
        return json.loads(cache.read_text())
    result = {'requested_url': url, 'source_url': url, 'verified_date': '2026-10-14', 'status': 'Not fetched', 'text': '', 'emails': [], 'links': []}
    try:
        if not safe_url(url):
            result['status'] = 'Unsafe URL skipped'
            return result
        response = subprocess.run(['curl', '--silent', '--show-error', '--location', '--max-redirs', '5',
                                   '--max-time', '14', '--connect-timeout', '7', '--compressed',
                                   '--user-agent', 'TravelFrameResearch/1.0 (public business contact research)',
                                   '--write-out', '\n__TF_STATUS__%{http_code} %{url_effective}', '--url', url],
                                  capture_output=True, timeout=18)
        body, _, footer = response.stdout.rpartition(b'\n__TF_STATUS__')
        code_url = footer.decode('utf-8', errors='replace').split(' ', 1)
        result['http_status'] = int(code_url[0]) if code_url and code_url[0].isdigit() else None
        result['source_url'] = code_url[1] if len(code_url) == 2 else url
        if response.returncode:
            result['status'] = 'Timeout' if response.returncode == 28 else 'Public website unavailable'
            cache.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
            return result
        if result['http_status'] != 200:
            result['status'] = f'HTTP {result["http_status"]}; no bypass'
            cache.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
            return result
        if not safe_url(result['source_url']):
            result['status'] = 'Unsafe redirect skipped'
            return result
        source = body[:1_500_000].decode('utf-8', errors='replace')
        if re.search(r'captcha|verify you are human|just a moment\.\.\.|access denied', plain(source)[:1500], re.I):
            result['status'] = 'Public access blocked; no bypass'
        else:
            result['status'] = 'OK'
            title = re.search(r'<title[^>]*>(.*?)</title>', source, re.S | re.I)
            result['title'] = plain(title.group(1)) if title else ''
            result['text'] = plain(source)[:24000]
            visible = html.unescape(re.sub(r'<(?:script|style)\b[^>]*>.*?</(?:script|style)>', '', source, flags=re.S | re.I))
            emails = set(x.lower().strip('.,;:') for x in EMAIL.findall(visible))
            # Cloudflare email protection is obfuscated public contact text, decoded by its public client script.
            for value in re.findall(r'data-cfemail=["\x27]([0-9a-f]+)', source, re.I):
                try:
                    b = bytes.fromhex(value)
                    decoded = bytes(c ^ b[0] for c in b[1:]).decode('utf-8')
                    if EMAIL.fullmatch(decoded):
                        emails.add(decoded.lower())
                except (ValueError, UnicodeDecodeError):
                    pass
            result['emails'] = sorted(e for e in emails if not re.search(r'example\.|test@|sentry|wixpress|\.png$|\.jpg$|\.webp$|\.svg$', e))
            links = []
            for href, label in re.findall(r'<a\b[^>]*href=["\x27]([^"\x27]+)["\x27][^>]*>(.*?)</a>', source, re.S | re.I):
                resolved = urllib.parse.urljoin(result['source_url'], html.unescape(href))
                if domain(resolved) == domain(result['source_url']) and CONTACT.search(href + ' ' + plain(label)) and safe_url(resolved):
                    links.append(resolved.split('#')[0])
            result['links'] = list(dict.fromkeys(links))[:15]
    except Exception as exc:
        result['status'] = type(exc).__name__
    cache.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    return result


def enrich(url):
    pages = [fetch(url)]
    if pages[0]['status'] == 'OK':
        for link in pages[0]['links'][:2]:
            if link == pages[0]['source_url']:
                continue
            time.sleep(0.4)
            pages.append(fetch(link))
    return {'domain': domain(url), 'requested_url': url, 'pages': pages}


def main():
    import sys
    CACHE.mkdir(parents=True, exist_ok=True)
    input_file = OUT / (sys.argv[1] if len(sys.argv) > 1 else 'registry-records.json')
    records = json.loads(input_file.read_text())
    sites = {}
    for row in records:
        urls = row.get('website_urls', [])
        if not urls:
            urls = ['https://' + e.split('@')[1] for e in row.get('emails', []) if e.split('@')[1] not in FREE]
        for url in urls:
            if safe_url(url):
                # One crawl per domain; property-specific paths are retained when present.
                sites.setdefault(domain(url), url)
    output_file = OUT / 'web-evidence.jsonl'
    existing = {}
    if output_file.exists():
        for line in output_file.read_text().splitlines():
            r = json.loads(line)
            existing[r['domain']] = r
    pending = [u for d, u in sites.items() if d not in existing]
    print(f'Public website domains: {len(sites)}; cached {len(existing)}; pending {len(pending)}', flush=True)
    done = 0
    with output_file.open('a', encoding='utf-8') as handle, concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(enrich, pending):
            handle.write(json.dumps(result, ensure_ascii=False) + '\n')
            handle.flush()
            done += 1
            if done % 20 == 0 or done == len(pending):
                print(f'Website domains checked {done}/{len(pending)}', flush=True)


if __name__ == '__main__':
    main()
