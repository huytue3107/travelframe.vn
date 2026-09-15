# Sources — esim-setup-reel (2026-09-12, sửa theo review 2026-09-12)

## Patterns used
- P-001 (hook hoàn cảnh + promise), P-004 (trap→move), P-005 (pro move),
  P-007 (comment-keyword → DM), V-01 (giọng), V-02 (câu ngắn), V-03 (emoji),
  V-06 (ký tên + hashtag), V-07 (claim VERIFY), V-09 (Train Street — không áp dụng,
  nội dung không nhắc), I-004 (ý tưởng gốc)

## Inspiration
- Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md (self_exemplar — topic gốc; câu chữ đã
  viết lại toàn bộ sau review no-copy 2026-09-12, checker xác nhận không còn
  verbatim ≥8 từ)
- Research-Insights/Library/knowledge/patterns.md (P-001, P-004, P-005, P-007)
- Research-Insights/Library/knowledge/ideas-backlog.md (I-004)

## Claims
| Claim | Trạng thái | Ghi chú |
|---|---|---|
| Giá tourist SIM sân bay ~$15–25 | [VERIFY] | cần 2 nguồn gần ngày đăng (V-08) |
| Giá eSIM ~$6–8 | [VERIFY] | cần 2 nguồn gần ngày đăng (V-08) |
| Viettel/Vinaphone là mạng người địa phương dùng | [VERIFY] | có marker trong reel-script + caption "no sponsor" |
| SIM desk "costs more" | [VERIFY] | marker trong reel-script beat one |
| Setup "a couple of minutes" | đã nới từ "2 minutes" thành cụm mơ hồ, không cần verify số |

## Checklist (kết quả thật — chạy 2026-09-12)
- check_draft.py caption.md --type reel --sources exemplar: status=flagged —
  flags: ["2 [VERIFY] marker(s) remain"], hard_errors=[], overlap overlaps=0.
- check_draft.py reel-script.md --type reel --no-expect-hashtag --sources exemplar:
  status=flagged — flags: ["2 [VERIFY] marker(s) remain"], hard_errors=[].
- validate_knowledge.py: valid=true, 23 entries.
- Trạng thái: drafted_flagged (4 [VERIFY] hợp lệ, chờ verify theo V-08 trước đăng)
