#!/usr/bin/env python3
"""Validate provenance, public email domains and export the qualified research tables."""
import concurrent.futures
import csv
import hashlib
import json
import re
import subprocess
from collections import Counter, defaultdict
from pathlib import Path
from hanoi_lodging_web_enrich import EMAIL, domain

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'Research-Insights/Competitive/2026-10-14-hanoi-lodging-partners'
REASONS = {'audience': 'Có tín hiệu phục vụ khách du lịch/quốc tế', 'location': 'Vị trí tại Hà Nội là tín hiệu phù hợp chính',
           'local_experience': 'Trải nghiệm địa phương/boutique bổ trợ cho TravelFrame', 'concierge': 'Có dịch vụ tour/concierge hỗ trợ giới thiệu trải nghiệm',
           'insufficient_evidence': 'Chưa đủ bằng chứng về audience hoặc khả năng giới thiệu khách', 'disqualifier': 'Có dấu hiệu ngoài địa bàn hoặc không phải cơ sở lưu trú'}
SCOPE = {'hotel_homestay_hanoi': 'Khách sạn/homestay Hà Nội', 'other_lodging_hanoi': 'Lưu trú khác tại Hà Nội',
         'outside_hanoi': 'Ngoài Hà Nội', 'not_a_property': 'Không phải cơ sở lưu trú', 'uncertain': 'Chưa xác minh loại/địa bàn'}


def dns_status(host):
    try:
        r = subprocess.run(['dig', '+time=2', '+tries=1', '+noall', '+answer', '+comments', 'MX', host], capture_output=True, text=True, timeout=5)
        status = re.search(r'status:\s*([A-Z]+)', r.stdout)
        if status and status.group(1) == 'NXDOMAIN':
            return host, 'NXDOMAIN — domain chưa tồn tại khi kiểm tra'
        if re.search(r'\sIN\s+MX\s+0\s+\.\s*$', r.stdout, re.M):
            return host, 'Null MX — domain không nhận email'
        if re.search(r'\sIN\s+MX\s+\d+\s+\S+', r.stdout):
            return host, 'Có MX — chưa kiểm tra mailbox/deliverability'
        a = subprocess.run(['dig', '+time=2', '+tries=1', '+short', 'A', host], capture_output=True, text=True, timeout=5)
        if re.search(r'^\d+\.\d+\.\d+\.\d+$', a.stdout, re.M):
            return host, 'Có A; chưa tìm thấy MX — cần kiểm tra thêm'
        return host, 'DNS chưa xác minh được'
    except Exception:
        return host, 'DNS chưa xác minh được'


def safe(value):
    if isinstance(value, str) and value[:1] in {'=', '+', '-', '@'}:
        return "'" + value
    return value


def write_csv(file, records, fields):
    with file.open('w', encoding='utf-8-sig', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows({k: safe(row.get(k, '')) for k in fields} for row in records)


def main():
    rows = json.loads((OUT / 'evaluated-records.json').read_text())
    # Normalize literal email spans without inheriting HTML attribute prefixes.
    # Raw evidence remains intact; placeholder/provider contacts are quarantined.
    suppressed = []
    provider_domains = {'masothue.com', 'trangvangtructuyen.vn', 'trangvangvietnam.com', 'yellowpages.vn', 'booking.com', 'agoda.com', 'tripadvisor.com', 'traveloka.com'}
    page_text = {}
    for line in (OUT / 'web-evidence.jsonl').read_text().splitlines():
        for page in json.loads(line)['pages']:
            page_text[page['source_url']] = page.get('text', '').lower()
    for row in rows:
        clean = []
        for e in row['email_evidence']:
            spans = EMAIL.findall(e['email'])
            if len(spans) != 1:
                suppressed.append({**e, 'property_id': row['property_id'], 'reason': 'No unambiguous conventional email span'})
                continue
            value = spans[0].lower()
            local, host = value.split('@')
            if host in provider_domains or local in {'hidden', 'example', 'test', 'dummy', 'yourmail', 'youremail', 'email', 'username'}:
                suppressed.append({**e, 'property_id': row['property_id'], 'reason': 'Publisher or placeholder email; not a property contact'})
                continue
            if e['source_type'] == 'Public property website' and re.match(r'^[nrt](?:info|reservation|booking|contact|sales|enquiry)', local) and value not in page_text.get(e['source_url'], ''):
                suppressed.append({**e, 'property_id': row['property_id'], 'reason': 'Possible escaped-newline prefix; publication requires manual confirmation'})
                continue
            clean.append({**e, 'email': value})
        row['email_evidence'] = list({(e['email'], e['source_url']): e for e in clean}.values())
        row['emails'] = sorted({e['email'] for e in row['email_evidence']})
    (OUT / 'email-qa-suppressed.json').write_text(json.dumps(suppressed, ensure_ascii=False, indent=2))
    assert len({r['property_id'] for r in rows}) == len(rows), 'Property ID collision'
    ids = {r['property_id'] for r in rows}
    usage = json.loads((OUT / 'jev-usage.json').read_text())
    assert usage['cap_usd'] == .12 and usage['estimated_cost_usd'] <= .12, 'Jev budget exceeded'
    runs = [json.loads(f.read_text()) for f in (OUT / 'raw').glob('apify-*-run.json')]
    apify_cost = sum(r.get('usageTotalUsd', 0) for r in runs)
    assert apify_cost <= 5, 'Apify budget exceeded'
    assert all(r['status'] == 'SUCCEEDED' for r in runs), 'Apify run not complete'
    domains = {e['email'].split('@')[1] for r in rows for e in r['email_evidence'] if EMAIL.fullmatch(e['email'])}
    dns_file = OUT / 'email-domain-checks.json'
    dns = json.loads(dns_file.read_text()) if dns_file.exists() else {}
    pending = sorted(domains - dns.keys())
    print(f'Email domains: {len(domains)}; DNS checks pending {len(pending)}', flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        for host, status in pool.map(dns_status, pending):
            dns[host] = status
    dns_file.write_text(json.dumps(dns, ensure_ascii=False, indent=2))
    tables = []
    contacts = defaultdict(lambda: {'property_ids': set(), 'property_names': set(), 'source_urls': set(), 'source_types': set(), 'priorities': [], 'scores': []})
    tiers = Counter()
    for row in rows:
        j = row.get('jev') or {}
        scope = j.get('scope', 'uncertain')
        score = j.get('score100')
        confidence = j.get('fit_confidence')
        in_scope = scope in {'hotel_homestay_hanoi', 'other_lodging_hanoi'}
        web_current = any(p['identity_match'] for p in row['web_pages'])
        good = [e for e in row['emails'] if EMAIL.fullmatch(e) and dns.get(e.split('@')[1], '').startswith('Có MX')]
        if not in_scope and scope != 'uncertain':
            priority = 'Excluded'
        elif not row.get('jev') or scope == 'uncertain' or (j.get('scope_confidence') or 0) < .55:
            priority = 'Review'
        elif score is not None and score >= 65 and (confidence or 0) >= .55 and good and web_current:
            priority = 'P1'
        elif score is not None and score >= 50 and (confidence or 0) >= .4:
            priority = 'P2'
        else:
            priority = 'P3'
        tiers[priority] += 1
        # Role inboxes first; confirmed public website evidence wins ties.
        def email_rank(email):
            on_web = any(e['email'] == email and e['source_type'] == 'Public property website' for e in row['email_evidence'])
            role = bool(re.match(r'^(sales|partner|business|concierge|info|contact|hello|reservation|booking|enquir|reception)', email))
            return (not on_web, not role, email)
        ordered = sorted(good or row['emails'], key=email_rank)
        primary = ordered[0] if ordered else ''
        primary_sources = [e for e in row['email_evidence'] if e['email'] == primary]
        source_status = 'Xác nhận trên website cơ sở' if any(e['source_type'] == 'Public property website' for e in primary_sources) else 'Chỉ thấy trên danh bạ/snippet; cần xác nhận lại' if primary else 'Chưa tìm thấy email công khai'
        reasons = REASONS.get(j.get('reason'), 'Chưa chấm Jev — đã đạt trần chi phí được duyệt')
        record = {'property_id': row['property_id'], 'priority': priority, 'name': row['name'], 'scope': SCOPE.get(scope, scope),
                  'address': row['address'] or 'Chưa xác minh địa chỉ đường phố', 'jev_score_100': score,
                  'jev_confidence': confidence, 'reason': reasons, 'primary_email': primary,
                  'all_emails': '; '.join(ordered), 'email_domain_status': dns.get(primary.split('@')[1], '') if primary else '',
                  'email_publication_status': source_status,
                  'website': next((p['source_url'] for p in row['web_pages'] if p['identity_match']), row['website_urls'][0] if row['website_urls'] else ''),
                  'current_website_match': web_current, 'phone_source_value': row['phone'],
                  'sources': '\n'.join(s['url'] for s in row['sources']),
                  'email_sources': '\n'.join(sorted({e['source_url'] for e in row['email_evidence']})),
                  'checked_date': '2026-10-14', 'model': j.get('model', ''),
                  'active_business_status': 'Chưa xác minh trạng thái hoạt động bằng nguồn độc lập'}
        tables.append(record)
        if in_scope:
            for e in row['email_evidence']:
                assert e['source_url'].startswith(('http://', 'https://')), 'Email without public source URL'
                if not EMAIL.fullmatch(e['email']):
                    continue
                c = contacts[e['email']]
                c['property_ids'].add(row['property_id'])
                c['property_names'].add(row['name'])
                c['source_urls'].add(e['source_url'])
                c['source_types'].add(e['source_type'])
                c['priorities'].append(priority)
                if score is not None:
                    c['scores'].append(score)
    order = {'P1': 0, 'P2': 1, 'P3': 2, 'Review': 3, 'Excluded': 4}
    tables.sort(key=lambda r: (order[r['priority']], -(r['jev_score_100'] or 0), r['name']))
    email_table = []
    for email, c in contacts.items():
        best = min(c['priorities'], key=lambda v: order[v])
        email_table.append({'email': email, 'priority': best, 'best_jev_score_100': max(c['scores']) if c['scores'] else None,
                            'property_names': '; '.join(sorted(c['property_names'])), 'property_ids': '; '.join(sorted(c['property_ids'])),
                            'associated_property_count': len(c['property_ids']), 'domain_check': dns[email.split('@')[1]],
                            'publication_status': 'Xác nhận trên website cơ sở' if 'Public property website' in c['source_types'] else 'Danh bạ/snippet; cần xác nhận lại',
                            'source_types': '; '.join(sorted(c['source_types'])), 'source_urls': '\n'.join(sorted(c['source_urls'])), 'checked_date': '2026-10-14',
                            'deliverability': 'Chưa kiểm tra mailbox; chưa gửi email'})
    email_table.sort(key=lambda r: (order[r['priority']], -(r['best_jev_score_100'] or 0), r['email']))
    eligible = [r for r in tables if r['priority'] in {'P1', 'P2'}]
    coverage = []
    query_total = set()
    for stage in ['pilot', 'districts', 'wards', 'contacts']:
        inp = json.loads((OUT / 'raw' / f'apify-{stage}-input.json').read_text())
        results = json.loads((OUT / 'raw' / f'apify-{stage}-results.json').read_text())
        requested = set(inp['queries'].splitlines())
        returned = {r.get('searchQuery', {}).get('term') for r in results}
        query_total.update(requested)
        coverage.append({'stage': stage, 'requested_unique': len(requested), 'returned_unique': len(requested & returned),
                         'missing_queries': sorted(requested - returned), 'result_pages': len(results),
                         'organic_rows': sum(len(x.get('organicResults', [])) for x in results)})
    ward_results = json.loads((OUT / 'raw/apify-wards-results.json').read_text())
    wards = json.loads((OUT / 'hanoi-wards.json').read_text())
    ward_table = []
    for name in wards['names']:
        matching = [r for r in ward_results if f'"{name}"' in r.get('searchQuery', {}).get('term', '')]
        ward_table.append({'area': name, 'requested_queries': 2, 'returned_queries': len({r['searchQuery']['term'] for r in matching}),
                           'organic_rows': sum(len(r.get('organicResults', [])) for r in matching), 'source_url': wards['source_url']})
    assert len(ward_table) == 126, 'Administrative coverage incomplete'
    assert all(r['returned_queries'] == 2 for r in ward_table), 'Ward queries not complete'
    assert all(not s['missing_queries'] for s in coverage), 'Discovery queries not complete'
    summary = {'date': '2026-10-14', 'status': 'Research / Review; no outreach', 'apify_cost_usd': apify_cost,
               'jev_known_cost_usd': usage.get('known_cost_usd'), 'jev_cost_upper_bound_usd': usage['estimated_cost_usd'],
               'candidates': len(tables), 'jev_assessed_current': usage['assessed'], 'priorities': dict(tiers),
               'hanoi_properties': sum(r['scope'] in {'Khách sạn/homestay Hà Nội', 'Lưu trú khác tại Hà Nội'} for r in tables),
               'hotel_homestay_hanoi': sum(r['scope'] == 'Khách sạn/homestay Hà Nội' for r in tables),
               'properties_with_email_hanoi': len({p for c in contacts.values() for p in c['property_ids']}),
               'public_unique_emails_hanoi': len(email_table), 'public_email_domains_with_mx': sum(r['domain_check'].startswith('Có MX') for r in email_table),
               'shortlist': len(eligible), 'unique_queries_all_stages': len(query_total), 'coverage': coverage,
               'source_registry_count': 566, 'source_association_count': 90, 'ward_count': 126}
    summary['jev_pending'] = len(tables) - summary['jev_assessed_current']
    summary['email_qa_suppressed_evidence_rows'] = len(suppressed)
    for item in eligible:
        assert item['sources'] and item['jev_score_100'] is not None
    assert all(set(r['property_ids'].split('; ')) <= ids for r in email_table)
    write_csv(OUT / 'Hanoi-Lodging-All-Candidates.csv', tables, list(tables[0]))
    write_csv(OUT / 'Hanoi-TravelFrame-Partner-Shortlist.csv', eligible, list(tables[0]))
    write_csv(OUT / 'Hanoi-Partner-Public-Emails.csv', email_table, list(email_table[0]))
    pending_rows = [r for r in tables if not r['model']]
    write_csv(OUT / 'Hanoi-Jev-Pending.csv', pending_rows, list(tables[0]))
    (OUT / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2))
    (OUT / 'workbook-data.json').write_text(json.dumps({'summary': summary, 'properties': tables, 'shortlist': eligible, 'emails': email_table, 'wards': ward_table}, ensure_ascii=False, indent=2))
    report = f'''# Hà Nội — đối tác lưu trú cho TravelFrame\n\n**Ngày:** 2026-10-14 · **Trạng thái:** Research / Review\n\nĐã đánh giá Jev {summary['jev_assessed_current']:,}/{summary['candidates']:,} ứng viên; **{summary['jev_pending']:,} ứng viên còn chờ Jev** do trần chi phí. Trong số đã chấm, {summary['hanoi_properties']:,} bản ghi được phân loại là cơ sở lưu trú tại Hà Nội; {summary['hotel_homestay_hanoi']:,} thuộc nhóm khách sạn/homestay. Danh sách ưu tiên có {summary['shortlist']:,} cơ sở P1/P2.\n\nTìm thấy {summary['public_unique_emails_hanoi']:,} email công khai, gắn với {summary['properties_with_email_hanoi']:,} cơ sở lưu trú Hà Nội đã phân loại. {summary['public_email_domains_with_mx']:,} địa chỉ có tên miền trả về MX. Đây không phải kiểm chứng mailbox hoặc khả năng nhận thư. Email trong các bản ghi chưa chấm vẫn được giữ ở bảng ứng viên/chờ Jev.\n\nChi phí Apify: **{apify_cost:.5f} USD** credit. Jev: **{summary['jev_known_cost_usd']:.6f} USD** theo input usage đã xác nhận; mức trên gồm dự phòng cho request timeout: **{summary['jev_cost_upper_bound_usd']:.6f} USD**. Cả hai nằm trong trần đã duyệt.\n\nĐộ phủ: đủ 126 xã/phường, tên gọi cũ của 30 quận/huyện, {summary['unique_queries_all_stages']:,} truy vấn khác nhau; đối soát 566 bản ghi danh bạ du lịch quốc gia và 90 bản ghi hiệp hội Hoàn Kiếm trước lọc địa bàn/loại cơ sở. Các truy vấn được hoàn tất không chứng minh đã tìm đủ 100% cơ sở hoạt động.\n\n## Cách sử dụng\n\n- P1: điểm Jev ≥65, confidence ≥0,55, có website khớp và email domain có MX. Ưu tiên review để tiếp cận.\n- P2: điểm ≥50, confidence ≥0,4; còn khoảng trống bằng chứng hoặc liên hệ.\n- P3: tín hiệu yếu hoặc thiếu bằng chứng; không đồng nghĩa cơ sở kém chất lượng.\n- Review: chưa chấm Jev, identity/địa bàn hoặc độ chắc chắn chưa đủ.\n- Excluded: cơ sở ngoài Hà Nội hoặc bản ghi không phải cơ sở lưu trú. Giữ nguồn để audit.\n\nJev dùng rubric trong [METHOD.md](METHOD.md), trả typed choice/score với model `jev-1.13.0`. Điểm quy đổi từ mức 0–4 sang 0–100, phục vụ ưu tiên nghiên cứu; không phải tỷ lệ thành công hợp tác. Chưa xác minh willingness to partner, guest mix, giấy phép, quyền quyết định hay commission.\n\nCác bản ghi có thể chứa tên cũ, chi nhánh, OTA alias hoặc contact của cả nhóm khách sạn. Email công khai của danh bạ cũ được giữ kèm nguồn và trạng thái, không tự nâng thành contact hiện hành. Cơ sở không có website/email vẫn được giữ. Không gửi thư, tạo lead live hay chạy automation.\n\n## Files\n\n- [Toàn bộ ứng viên](Hanoi-Lodging-All-Candidates.csv)\n- [Ưu tiên hợp tác](Hanoi-TravelFrame-Partner-Shortlist.csv)\n- [Email công khai](Hanoi-Partner-Public-Emails.csv)\n- [Chờ Jev](Hanoi-Jev-Pending.csv)\n- [Phương pháp và giới hạn](METHOD.md)\n\n## Ưu tiên review trước\n\n'''
    report = report.replace('dự phòng cho request timeout', 'dự phòng cho request chưa đối soát chi phí')
    if summary['jev_pending'] == 0:
        report = report.replace('; **0 ứng viên còn chờ Jev** do trần chi phí.', '; đã chấm hết danh sách ứng viên đã thu thập.')
        report = report.replace(' Email trong các bản ghi chưa chấm vẫn được giữ ở bảng ứng viên/chờ Jev.', '')
    for row in eligible[:10]:
        report += f"- **{row['name']}** — {row['priority']}, {row['jev_score_100']}/100: {row['reason']}. Email: {row['primary_email'] or 'Chưa tìm thấy'}. [Nguồn]({row['sources'].splitlines()[0]}).\n"
    (OUT / 'README.md').write_text(report, encoding='utf-8')
    print(json.dumps(summary, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    main()
