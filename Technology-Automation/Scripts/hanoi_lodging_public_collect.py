#!/usr/bin/env python3
"""One-off public registry research. No credentials, paid APIs or outreach."""
import concurrent.futures
import gzip
import html
import json
import math
import re
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'Research-Insights/Competitive/2026-10-14-hanoi-lodging-partners'
RAW = OUT / 'raw'
DATE = '2026-10-14'
REGISTRY = 'https://csdl.vietnamtourism.gov.vn/cslt?province=01'
WARD_SOURCE = 'https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-1656-nq-ubtvqh15-sap-xep-cac-dvhc-cap-xa-cua-thanh-pho-ha-noi-nam-2025-119250616192433872.htm'


def plain(s):
    s = re.sub(r'<(?:script|style)\b[^>]*>.*?</(?:script|style)>', '', s, flags=re.S | re.I)
    return unicodedata.normalize('NFC', re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', s))).strip())


def get(url, name):
    file = RAW / name
    if file.exists():
        return file.read_text(encoding='utf-8')
    req = urllib.request.Request(url, headers={'User-Agent': 'TravelFrameResearch/1.0 (public business directory research)'})
    with urllib.request.urlopen(req, timeout=25) as response:
        raw = response.read(4_000_000)
        if response.headers.get('Content-Encoding') == 'gzip' or raw.startswith(b'\x1f\x8b'):
            raw = gzip.decompress(raw)
        text = raw.decode('utf-8', errors='replace')
    # Do not retain transient form CSRF values in evidence snapshots.
    text = re.sub(r'(<input[^>]*name="csrf_name"[^>]*value=")[^"]*', r'\1[REDACTED]', text)
    file.write_text(text, encoding='utf-8')
    time.sleep(0.3)
    return text


def registry_rows(text, source):
    rows = []
    matches = list(re.finditer(r'<h4[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>.*?</h4>', text, re.S | re.I))
    for i, match in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else text.find('</form>', match.end())
        block = text[match.start():end if end > match.start() else match.end() + 12000]
        evidence = plain(block)
        address = re.search(r'Địa chỉ:\s*(.*?)(?:</span>|</div>)', block, re.S)
        emails = sorted(set(x.lower().strip('.,;') for x in re.findall(r'[A-Za-z0-9.!#$%&\x27*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+', html.unescape(block))))
        urls = re.findall(r'href=["\x27](https?://[^"\x27]+)', block, re.I)
        website_urls = [u for u in urls if not re.search(r'vietnamtourism|google|facebook|youtube|mailto', u, re.I)]
        # Some records display website as plain text.
        displayed = re.search(r'Website:\s*(.*?)(?:</span>|</div>)', block, re.S | re.I)
        if displayed:
            value = plain(displayed.group(1))
            if re.match(r'(?:https?://|www\.)', value):
                website_urls.append(value if value.startswith('http') else 'https://' + value)
        room = re.search(r'Số phòng:\s*(\d+)', evidence)
        phone = re.search(r'Điện thoại (?:cố định|di động):\s*(.*?)(?:Email:|Website:|Giá:|Thông tin|$)', evidence)
        rows.append({'name': plain(match.group(2)), 'address': plain(address.group(1)) if address else '',
                     'source_url': urllib.parse.urljoin('https://csdl.vietnamtourism.gov.vn', html.unescape(match.group(1))),
                     'listing_url': source, 'source_type': 'National tourism registry', 'emails': emails,
                     'website_urls': sorted(set(website_urls)), 'phone': phone.group(1).strip()[:100] if phone else '',
                     'rooms_source_value': int(room.group(1)) if room else None,
                     'evidence': evidence[:6000], 'verified_date': DATE})
    return rows


def main():
    RAW.mkdir(parents=True, exist_ok=True)
    first = get(REGISTRY, 'registry-page-001.html')
    total = int(re.search(r'Tổng số:\s*(\d+)', plain(first)).group(1))
    first_rows = registry_rows(first, REGISTRY)
    size = len(first_rows)
    if size == 0:
        raise RuntimeError('Registry returned no parseable rows')
    rows = list(first_rows)
    audit = [{'page': 1, 'url': REGISTRY, 'rows': len(first_rows), 'status': 'OK'}]
    pages = math.ceil(total / size)
    for page in range(2, pages + 1):
        url = REGISTRY + '&page=' + str(page)
        try:
            data = registry_rows(get(url, f'registry-page-{page:03d}.html'), url)
            rows.extend(data)
            audit.append({'page': page, 'url': url, 'rows': len(data), 'status': 'OK'})
        except Exception as exc:
            audit.append({'page': page, 'url': url, 'rows': 0, 'status': type(exc).__name__})
        if page % 8 == 0:
            print(f'Registry pages {page}/{pages}; records {len(rows)}', flush=True)
    (OUT / 'registry-records.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT / 'registry-audit.json').write_text(json.dumps({'reported_total': total, 'records': len(rows), 'pages': audit}, ensure_ascii=False, indent=2), encoding='utf-8')
    decoded = RAW / 'hanoi-wards-source-decoded.html'
    wards_html = decoded.read_text(encoding='utf-8') if decoded.exists() else get(WARD_SOURCE, 'hanoi-wards-source.html')
    text = plain(wards_html)
    # The Resolution names each new unit explicitly; retain the final unchanged unit if applicable.
    matches = re.findall(r'có tên gọi là (?:phường|xã)\s+([^.;]+)', text)
    wards = list(dict.fromkeys(x.strip().replace('Đại Xuyê n', 'Đại Xuyên') for x in matches))
    if len(wards) < 120:
        # Unicode accents can be decomposed in the government text; plain() normalizes NFC.
        matches = re.findall(r'có tên gọi là (?:phường|xã)\s+([^.;]+)', text)
        wards = list(dict.fromkeys(wards + [x.strip() for x in matches]))
    (OUT / 'hanoi-wards.json').write_text(json.dumps({'source_url': WARD_SOURCE, 'names': wards}, ensure_ascii=False, indent=2), encoding='utf-8')
    association = []
    for page in range(1, 9):
        url = 'https://www.hoankiemtourism.com/hotels.html' + (f'?p={page}' if page > 1 else '')
        source = get(url, f'association-page-{page:03d}.html')
        for block in re.findall(r'<li>\s*<div class="row" data-id=.*?</li>', source, re.S):
            title = re.search(r'<a[^>]+href="([^"]+)"[^>]+class="name"[^>]*>(.*?)</a>', block, re.S)
            if not title:
                continue
            address = re.search(r'<p class="info[^>]*>(.*?)</p>', block, re.S)
            association.append({'name': plain(title.group(2)), 'address': plain(address.group(1)) if address else '',
                                'source_url': html.unescape(title.group(1)).split('?')[0], 'listing_url': url,
                                'source_type': 'Hoan Kiem Tourism Association directory', 'emails': [], 'website_urls': [],
                                'phone': '', 'evidence': plain(block), 'verified_date': DATE})
    (OUT / 'association-records.json').write_text(json.dumps(association, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'registry_total': total, 'collected': len(rows), 'rows_with_email': sum(bool(r['emails']) for r in rows), 'wards': len(wards), 'association_rows': len(association)}, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
