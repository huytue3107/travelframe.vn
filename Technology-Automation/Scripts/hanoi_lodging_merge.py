#!/usr/bin/env python3
"""Merge source candidates without collapsing distinct branches; attach web evidence."""
import difflib
import hashlib
import html
import json
import re
import unicodedata
import urllib.parse
from collections import Counter, defaultdict
from pathlib import Path
from hanoi_lodging_web_enrich import domain, FREE, EMAIL

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'Research-Insights/Competitive/2026-10-14-hanoi-lodging-partners'
AGGREGATORS = re.compile(r'booking\.|agoda\.|tripadvisor\.|trip\.com|traveloka\.|trivago\.|expedia\.|hotels\.com|hotelscombined\.|planetofhotels\.|kayak\.|hometogo\.|momondo\.|airbnb\.|google\.|vietnamtourism\.|hoankiemtourism\.|facebook\.|instagram\.|youtube\.|tiktok\.', re.I)
LODGING = re.compile(r'hotel|homestay|hostel|resort|villa|khách sạn|khach san|căn hộ|apartment|nhà nghỉ|nha nghi|lưu trú|lodging|guesthouse|guest house', re.I)
LISTICLE = re.compile(r'\btop\s*\d|\b\d+\s+(?:best|khách sạn|homestay|hotels|hostels)|best hotels|hotels in|danh sách|tổng hợp|list of|where to stay|khách sạn tốt nhất|lưu ngay|review|cẩm nang|kinh nghiệm|bí quyết', re.I)


def normalize(value):
    value = unicodedata.normalize('NFD', value.lower().replace('đ', 'd'))
    value = ''.join(c for c in value if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+', ' ', value).strip()


def name_key(value):
    value = normalize(value)
    value = re.sub(r'^(?:khach san|nha nghi|hotel)\s+', '', value)
    value = re.sub(r'\b(?:official|website|home page|trang chu|welcome to)\b', '', value)
    return re.sub(r'\s+', ' ', value).strip()


def clean_title(value):
    value = html.unescape(value)
    value = re.sub(r'\s*[-|–—]\s*(?:Official.*|Updated.*|Booking\.com.*|Agoda.*|Trip\.com.*|Tripadvisor.*|Trang chủ.*|Home.*|Đặt phòng.*|Reviews.*|Giá.*)$', '', value, flags=re.I)
    value = re.sub(r'\s*\((?:Updated|Cập nhật|Prices).*$', '', value, flags=re.I)
    return value.strip()


def main():
    all_rows = []
    for file in ['registry-records.json', 'association-records.json']:
        p = OUT / file
        if p.exists():
            all_rows.extend(json.loads(p.read_text()))
    matches = {}
    rows = []
    for source in all_rows:
        k = (name_key(source['name']), normalize(source.get('address', '')))
        if k in matches:
            rows[matches[k]]['sources'].append({'url': source['source_url'], 'type': source['source_type'], 'evidence': source.get('evidence', '')})
            continue
        row = {**source, 'sources': [{'url': source['source_url'], 'type': source['source_type'], 'evidence': source.get('evidence', '')}],
               'email_evidence': [{'email': e, 'source_url': source.get('listing_url', source['source_url']), 'source_type': source['source_type'], 'association': 'Published for this registry record', 'verified_date': '2026-10-14'} for e in source.get('emails', [])],
               'web_pages': [], 'website_urls': source.get('website_urls', [])}
        rows.append(row)
        matches[k] = len(rows) - 1
    names = defaultdict(list)
    domains = defaultdict(list)
    for i, row in enumerate(rows):
        names[name_key(row['name'])].append(i)
        for url in row['website_urls']:
            domains[domain(url)].append(i)
        for email in row['emails']:
            host = email.split('@')[1]
            if host not in FREE:
                domains[host].append(i)
    raw_serp = []
    for f in sorted((OUT / 'raw').glob('apify-*-results.json')):
        pages = json.loads(f.read_text())
        for page in pages:
            for result in page.get('organicResults', []):
                raw_serp.append({**result, 'query': page.get('searchQuery', {}).get('term', ''), 'query_page': page.get('searchQuery', {}).get('page'), 'run_stage': f.stem})
    (OUT / 'serp-discovery-rows.json').write_text(json.dumps(raw_serp, ensure_ascii=False, indent=2))
    seen_urls = set()
    added = []
    for source in raw_serp:
        url = source.get('url', '').split('#')[0]
        if not url or url in seen_urls:
            continue
        seen_urls.add(url)
        name = clean_title(source.get('title', ''))
        evidence = (source.get('description') or '')
        if not LODGING.search(name) or LISTICLE.search(name):
            continue
        host = domain(url)
        is_agg = bool(AGGREGATORS.search(host))
        # Catalog pages are not individual properties. Keep only property-specific OTA/Facebook results.
        if is_agg and not re.search(r'/hotel/|/Hotel_Review-|/ho[0-9]+|/hotel/|facebook\.com/[^/?]+/?$', url):
            continue
        k = name_key(name)
        candidates = names.get(k, [])
        if not candidates and not is_agg:
            candidates = sorted(set(domains.get(host, [])))
        if len(candidates) == 1:
            row = rows[candidates[0]]
            row['sources'].append({'url': url, 'type': 'Apify organic search result', 'evidence': name + ' — ' + evidence})
            if not is_agg and url not in row['website_urls']:
                row['website_urls'].append(url)
            continue
        # Exact name with multiple addresses is ambiguous and must not collapse the branches.
        if len(candidates) > 1:
            continue
        row = {'name': name, 'address': '', 'source_url': url, 'listing_url': url,
               'source_type': 'Apify organic search result', 'emails': [], 'website_urls': [] if is_agg else [url],
               'phone': '', 'evidence': name + ' — ' + evidence, 'verified_date': '2026-10-14',
               'sources': [{'url': url, 'type': 'Apify organic search result', 'evidence': name + ' — ' + evidence}],
               'email_evidence': [], 'web_pages': [], 'discovery_query': source.get('query', '')}
        rows.append(row)
        i = len(rows) - 1
        names[k].append(i)
        if not is_agg:
            domains[host].append(i)
        added.append(i)
    web = {}
    web_file = OUT / 'web-evidence.jsonl'
    if web_file.exists():
        for line in web_file.read_text().splitlines():
            item = json.loads(line)
            web[item['domain']] = item
    for row in rows:
        for source in row['sources']:
            source['evidence'] = source['evidence'][:6000]
        row['sources'] = list({s['url']: s for s in row['sources']}.values())
        site_domains = {domain(u) for u in row['website_urls']}
        site_domains.update(e.split('@')[1] for e in row['emails'] if e.split('@')[1] not in FREE)
        for host in site_domains:
            if host not in web:
                continue
            for page in web[host]['pages']:
                if page['status'] != 'OK':
                    continue
                page_name = name_key(page.get('title', ''))
                text = page.get('text', '')
                title_words = set(name_key(row['name']).split()) - {'hanoi', 'hotel', 'hotels', 'homestay', 'hostel', 'spa', 'and', 'the', 'ha', 'noi', 'khach', 'san', 'resort', 'apartments', 'boutique'}
                page_identity = page_name + ' ' + normalize(host) + ' ' + normalize(text[:6000])
                page_words = set(page_identity.split())
                compact_identity = page_identity.replace(' ', '')
                unique_domain = len(set(domains.get(host, []))) == 1
                identity_match = sum(w in page_words or (len(w) >= 4 and w in compact_identity) for w in title_words) >= min(2, len(title_words)) if title_words else False
                hanoi_text = bool(re.search(r'\bHanoi\b|Hà Nội', text, re.I))
                # Cross-brand redirects, generic global chain pages and template providers require review.
                plausible_property_page = (identity_match and hanoi_text) or (unique_domain and identity_match)
                global_chains = {'accor.com', 'marriott.com', 'hilton.com', 'ihg.com', 'panpacific.com', 'wyndhamhotels.com', 'hyatt.com', 'ihgplc.com'}
                if host in global_chains and not re.search(r'Hanoi|Hà Nội|ha-noi|ha_noi', page.get('title', '') + ' ' + page['source_url'], re.I):
                    plausible_property_page = False
                row['web_pages'].append({'source_url': page['source_url'], 'title': page.get('title', ''), 'identity_match': plausible_property_page,
                                         'text': text[:12000] if plausible_property_page else text[:1200], 'http_status': page.get('http_status')})
                if plausible_property_page:
                    for email in page['emails']:
                        if not EMAIL.fullmatch(email):
                            continue
                        email_domain = email.split('@')[1]
                        if email_domain not in FREE and not (email_domain == host or host.endswith('.' + email_domain) or email in row['emails']):
                            continue
                        row['email_evidence'].append({'email': email, 'source_url': page['source_url'], 'source_type': 'Public property website',
                                                      'association': 'Property title/domain matched; business contact published', 'verified_date': '2026-10-14'})
        for source in row['sources']:
            if source['type'] != 'Apify organic search result' or AGGREGATORS.search(domain(source['url'])):
                continue
            host = domain(source['url'])
            for email in EMAIL.findall(source['evidence']):
                email = email.lower().strip('.,;')
                if email.split('@')[1] == host or email.split('@')[1] in FREE:
                    row['email_evidence'].append({'email': email, 'source_url': source['url'], 'source_type': 'Public search snippet',
                                                  'association': 'Published in property-related search snippet; current page publication not confirmed', 'verified_date': '2026-10-14'})
        row['email_evidence'] = list({(e['email'], e['source_url']): e for e in row['email_evidence']}.values())
        row['emails'] = sorted({e['email'] for e in row['email_evidence']})
        stable = name_key(row['name']) + '|' + normalize(row.get('address', '')) + '|' + row['source_url']
        row['property_id'] = 'HN-' + hashlib.sha256(stable.encode()).hexdigest()[:12].upper()
    (OUT / 'candidate-records.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2))
    print(json.dumps({'raw_serp_rows': len(raw_serp), 'unique_source_urls': len(seen_urls), 'candidates': len(rows),
                      'serp_candidates_added': len(added), 'with_email': sum(bool(r['emails']) for r in rows),
                      'email_addresses': len({e for r in rows for e in r['emails']}), 'web_evidence_domains': len(web)}, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
