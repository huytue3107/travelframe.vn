#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const runtimeModules = '/Users/macbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const bundledRequire = createRequire(path.join(runtimeModules, '__travel_frame_authoring__.cjs'));
const { Workbook, SpreadsheetFile } = await import(bundledRequire.resolve('@oai/artifact-tool'));
const root = path.resolve('Research-Insights/Competitive/2026-10-14-hanoi-lodging-partners');
const data = JSON.parse(await fs.readFile(path.join(root, 'workbook-data.json'), 'utf8'));
const wb = Workbook.create();
const priority = wb.worksheets.add('Ưu tiên');
const candidates = wb.worksheets.add('Ứng viên');
const emails = wb.worksheets.add('Emails');
const coverage = wb.worksheets.add('Độ phủ');
const teal = '#008AA3';
const dark = '#183B45';
const safe = value => typeof value === 'string' && /^[=+@-]/.test(value) ? "'" + value : value;
const column = n => {
  let name = '';
  while (n > 0) { n--; name = String.fromCharCode(65 + n % 26) + name; n = Math.floor(n / 26); }
  return name;
};
const formats = { date: 'yyyy-mm-dd', number: '0.0', percentage: '0%', integer: '#,##0' };

function table(sheet, name, top, headers, rows, widths) {
  const last = column(headers.length);
  const end = top + rows.length;
  sheet.getRange(`A${top}:${last}${end}`).values = [headers, ...rows.map(row => row.map(v => safe(v ?? '')))];
  const region = sheet.getRange(`A${top}:${last}${end}`);
  region.format.font = { name: 'Arial', size: 10, color: '#233238' };
  region.format.rowHeight = 36;
  region.format.verticalAlignment = 'center';
  region.format.wrapText = false;
  sheet.getRange(`A${top}:${last}${top}`).format = { fill: dark, font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' },
    horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true, rowHeight: 42 };
  headers.forEach((_, i) => sheet.getRange(`${column(i + 1)}${top}:${column(i + 1)}${end}`).format.columnWidth = widths[i] ?? 24);
  const t = sheet.tables.add(`A${top}:${last}${end}`, true, name);
  t.showFilterButton = true;
  sheet.freezePanes.freezeRows(top);
  sheet.freezePanes.freezeColumns(2);
  sheet.showGridLines = false;
  return { end, last, top };
}

function title(sheet, text, last) {
  sheet.getRange(`A2:${last}2`).format.font = { name: 'Arial', size: 15, color: dark, bold: true };
  sheet.getRange('A2').values = [[text]];
  sheet.getRange(`A2:${last}2`).format.rowHeight = 28;
  sheet.getRange(`A3:${last}3`).format.borders = { bottom: { style: 'thin', color: teal } };
}

const candidateHeaders = ['ID', 'Ưu tiên', 'Tên cơ sở / ứng viên', 'Phân loại Jev', 'Địa chỉ theo nguồn', 'Điểm Jev /100', 'Độ chắc chắn Jev',
  'Lý do chính', 'Email ưu tiên', 'Tất cả email công khai', 'MX / tên miền', 'Tình trạng xuất bản email', 'Website theo nguồn',
  'Website khớp', 'Điện thoại theo nguồn', 'Nguồn cơ sở', 'Nguồn email', 'Ngày kiểm tra', 'Model', 'Trạng thái hoạt động'];
const candidateRows = data.properties.map(r => [r.property_id, r.priority, r.name, r.scope, r.address, r.jev_score_100,
  r.jev_confidence, r.reason, r.primary_email, r.all_emails, r.email_domain_status, r.email_publication_status, r.website,
  r.current_website_match ? 'Có' : 'Chưa xác minh', r.phone_source_value, r.sources, r.email_sources,
  new Date(r.checked_date + 'T00:00:00Z'), r.model, r.active_business_status]);
title(candidates, 'ỨNG VIÊN · TOÀN BỘ NGUỒN VÀ KẾT QUẢ JEV', 'T');
const all = table(candidates, 'AllCandidates', 5, candidateHeaders, candidateRows,
  [19, 11, 44, 30, 48, 14, 17, 55, 40, 55, 47, 49, 45, 18, 24, 65, 65, 16, 18, 55]);
candidates.getRange(`F6:F${all.end}`).setNumberFormat(formats.number);
candidates.getRange(`G6:G${all.end}`).setNumberFormat(formats.percentage);
candidates.getRange(`R6:R${all.end}`).setNumberFormat(formats.date);
for (const c of ['C', 'D', 'E', 'H', 'K', 'L']) candidates.getRange(`${c}6:${c}${all.end}`).format.wrapText = true;
candidates.getRange(`A6:T${all.end}`).format.rowHeight = 44;
candidates.getRange(`B6:B${all.end}`).conditionalFormats.add('containsText', { text: 'Review', format: { fill: '#FFF2CC', font: { color: '#8A5B00' } } });
candidates.getRange(`B6:B${all.end}`).conditionalFormats.add('containsText', { text: 'Excluded', format: { fill: '#F5F5F5', font: { color: '#777777' } } });

title(priority, 'TRAVELFRAME · ĐỐI TÁC LƯU TRÚ HÀ NỘI', 'L');
priority.tabColor = teal;
priority.getRange('A4').values = [['Cơ sở Hà Nội']];
priority.getRange('B4').formulas = [[`=COUNTIF('Ứng viên'!D6:D${all.end},"Khách sạn/homestay Hà Nội")+COUNTIF('Ứng viên'!D6:D${all.end},"Lưu trú khác tại Hà Nội")`]];
priority.getRange('C4').values = [['Ưu tiên P1/P2']];
priority.getRange('D4').formulas = [[`=COUNTIF('Ứng viên'!B6:B${all.end},"P1")+COUNTIF('Ứng viên'!B6:B${all.end},"P2")`]];
priority.getRange('E4').values = [['Email công khai']];
priority.getRange('F4').values = [[data.summary.public_unique_emails_hanoi]];
priority.getRange('G4').values = [['Chờ Jev']];
priority.getRange('H4').formulas = [[`=COUNTBLANK('Ứng viên'!S6:S${all.end})`]];
priority.getRange('A4:L4').format.font = { name: 'Arial', size: 10, color: dark };
priority.getRange('A4:L4').format.rowHeight = 28;
for (const c of ['B', 'D', 'F', 'H']) {
  priority.getRange(`${c}4`).format.horizontalAlignment = 'center';
  priority.getRange(`${c}4`).format.font = { name: 'Arial', size: 11, bold: true, color: dark };
}
priority.getRange('A5').values = [[`Research / Review · ${data.summary.date} · Jev ${data.summary.jev_assessed_current}/${data.summary.candidates} · Cần xác nhận lại contact trước outreach.`]];
priority.getRange('A5:L5').format.font = { name: 'Arial', size: 10, italic: true, color: '#55676D' };
const shortHeaders = ['Ưu tiên', 'Tên cơ sở', 'Điểm Jev /100', 'Độ chắc chắn', 'Email ưu tiên', 'Xuất bản email', 'Địa chỉ theo nguồn', 'Lý do phù hợp', 'Website', 'MX / tên miền', 'Nguồn cơ sở', 'ID'];
const shortRows = data.shortlist.map(r => [r.priority, r.name, r.jev_score_100, r.jev_confidence, r.primary_email,
  r.email_publication_status, r.address, r.reason, r.website, r.email_domain_status, r.sources, r.property_id]);
const sh = table(priority, 'PartnerShortlist', 7, shortHeaders, shortRows,
  [17, 45, 16, 18, 43, 46, 50, 60, 45, 48, 65, 19]);
priority.getRange(`C8:C${sh.end}`).setNumberFormat(formats.number);
priority.getRange(`D8:D${sh.end}`).setNumberFormat(formats.percentage);
for (const c of ['B', 'F', 'G', 'H', 'J']) priority.getRange(`${c}8:${c}${sh.end}`).format.wrapText = true;
priority.getRange(`A8:L${sh.end}`).format.rowHeight = 44;
priority.getRange(`A8:A${sh.end}`).conditionalFormats.add('containsText', { text: 'P1', format: { fill: '#DBEEF1', font: { bold: true, color: dark } } });

title(emails, 'EMAIL CÔNG KHAI · DEDUP THEO ĐỊA CHỈ EMAIL', 'L');
emails.getRange('A4').values = [['MX chỉ xác nhận tên miền nhận email; chưa kiểm tra mailbox hoặc khả năng nhận thư.']];
emails.getRange('A4:L4').format.font = { name: 'Arial', size: 10, italic: true, color: '#55676D' };
const emailHeaders = ['Ưu tiên', 'Email', 'Cơ sở liên quan', 'Điểm cao nhất', 'Số cơ sở dùng inbox', 'MX / tên miền', 'Xuất bản email', 'Loại nguồn', 'URL nguồn', 'Ngày kiểm tra', 'ID cơ sở', 'Deliverability'];
const emailRows = data.emails.map(r => [r.priority, r.email, r.property_names, r.best_jev_score_100, r.associated_property_count,
  r.domain_check, r.publication_status, r.source_types, r.source_urls, new Date(r.checked_date + 'T00:00:00Z'), r.property_ids, r.deliverability]);
const em = table(emails, 'PublicEmails', 6, emailHeaders, emailRows, [17, 46, 65, 17, 21, 52, 51, 43, 70, 17, 55, 49]);
emails.getRange(`D7:D${em.end}`).setNumberFormat(formats.number);
emails.getRange(`E7:E${em.end}`).setNumberFormat(formats.integer);
emails.getRange(`J7:J${em.end}`).setNumberFormat(formats.date);
for (const c of ['C', 'F', 'G', 'H', 'L']) emails.getRange(`${c}7:${c}${em.end}`).format.wrapText = true;
emails.getRange(`A7:L${em.end}`).format.rowHeight = 44;
emails.getRange(`F7:F${em.end}`).conditionalFormats.add('containsText', { text: 'NXDOMAIN', format: { fill: '#FCE4D6', font: { color: '#9C2E00' } } });
emails.getRange(`F7:F${em.end}`).conditionalFormats.add('containsText', { text: 'chưa xác minh', format: { fill: '#FFF2CC', font: { color: '#8A5B00' } } });

title(coverage, 'ĐỘ PHỦ, CHI PHÍ VÀ GIỚI HẠN NGHIÊN CỨU', 'F');
const auditRows = [
  ['Danh bạ du lịch quốc gia', data.summary.source_registry_count, 'Bản ghi trước loại trùng/phân loại'],
  ['Hiệp hội Du lịch Hoàn Kiếm', data.summary.source_association_count, 'Có bản ghi ngoài Hà Nội; đã phân loại riêng'],
  ['Khu vực tên quận/huyện cũ', 30, 'Dùng để bổ sung truy vấn theo địa chỉ cũ'],
  ['Tổng truy vấn khác nhau', data.summary.unique_queries_all_stages, 'Tính distinct trên toàn bộ các stage'],
  ['Apify credit (USD)', data.summary.apify_cost_usd, 'Trần đã duyệt: 5 USD'],
  ['Jev usage xác nhận (USD)', data.summary.jev_known_cost_usd, 'Charged input tokens × 0.042 USD / triệu'],
  ['Jev gồm dự phòng (USD)', data.summary.jev_cost_upper_bound_usd, 'Trần 0,12 USD; giữ dự phòng request chưa đối soát chi phí'],
  ['Ứng viên chờ Jev', data.summary.jev_pending, 'Chưa nâng thành đối tác phù hợp'],
];
coverage.getRange('A4:C11').values = auditRows;
coverage.getRange('A4:C11').format.font = { name: 'Arial', size: 10, color: '#233238' };
coverage.getRange('A4:C11').format.rowHeight = 28;
coverage.getRange('A4:A11').format.columnWidth = 34;
coverage.getRange('B4:B11').format.columnWidth = 16;
coverage.getRange('C4:C11').format.columnWidth = 66;
coverage.getRange('B8:B10').setNumberFormat('"$"0.000000');
coverage.getRange('B4:B11').format.horizontalAlignment = 'center';
coverage.getRange('A13').values = [['Đủ truy vấn không đồng nghĩa tìm đủ 100% cơ sở đang hoạt động. Còn có thể có tên cũ, alias hoặc chi nhánh.']];
coverage.getRange('A14').values = [['P1/P2 là ưu tiên research; chưa xác minh guest mix, willingness, giấy phép, quyền ký hoặc commission.']];
coverage.getRange('A13:F14').format.font = { name: 'Arial', size: 10, italic: true, color: '#55676D' };
const wardRows = data.wards.map(r => [r.area, r.requested_queries, r.returned_queries, r.organic_rows, new Date(data.summary.date + 'T00:00:00Z'), r.source_url]);
const cov = table(coverage, 'AreaCoverage', 17, ['Xã/phường', 'Truy vấn', 'Đã trả kết quả', 'Organic rows', 'Ngày thu thập', 'Nguồn địa bàn'], wardRows, [34, 16, 20, 18, 18, 100]);
coverage.getRange(`B18:D${cov.end}`).setNumberFormat(formats.integer);
coverage.getRange(`E18:E${cov.end}`).setNumberFormat(formats.date);

wb.recalculate();
const summaryValues = priority.getRange('A4:H4').values[0];
if (summaryValues[1] !== data.summary.hanoi_properties || summaryValues[3] !== data.summary.shortlist || summaryValues[7] !== data.summary.jev_pending) throw new Error('Workbook summary does not reconcile');
const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',
  options: { useRegex: true, maxResults: 20 }, maxChars: 2000, summary: 'Final formula error scan' });
console.log(errors.ndjson);
for (const [name, range, file] of [['Ưu tiên', 'A1:H15', 'priority'], ['Ứng viên', 'A1:G13', 'candidates'],
  ['Emails', 'A1:G14', 'emails'], ['Độ phủ', 'A1:F25', 'coverage']]) {
  const preview = await wb.render({ sheetName: name, range, scale: 1.4, format: 'png' });
  await fs.writeFile(path.join(root, 'raw/' + file + '-preview.png'), new Uint8Array(await preview.arrayBuffer()));
}
console.log((await wb.inspect({ kind: 'region', sheetId: 'Ưu tiên', range: 'A4:H5', maxChars: 1600 })).ndjson);
const file = await SpreadsheetFile.exportXlsx(wb);
await file.save(path.join(root, 'TravelFrame-Hanoi-Lodging-Partners.xlsx'));
await fs.writeFile(path.join(root, 'workbook-validation.json'), JSON.stringify({ checked_at: new Date().toISOString(),
  properties: data.properties.length, shortlist: data.shortlist.length, emails: data.emails.length, wards: data.wards.length,
  summary_reconciled: true, previews_generated: 4, formula_error_scan: errors.ndjson }, null, 2));
console.log(JSON.stringify({ saved: path.join(root, 'TravelFrame-Hanoi-Lodging-Partners.xlsx'), sheets: 4,
  rows: { shortlist: data.shortlist.length, candidates: data.properties.length, emails: data.emails.length, wards: data.wards.length } }));
