# Knowledge base schema — Research-Insights/Library/knowledge/

## Files

| File | Vai trò | Entry ID |
|---|---|---|
| `voice-playbook.md` | Quy tắc giọng TravelFrame | `V-##` |
| `patterns.md` | Công thức hook/beat/CTA/caption/format | `P-###` |
| `ideas-backlog.md` | Ngân hàng ý tưởng nội dung | `I-###` |
| `runs/<YYYY-MM-DD-scope>/learning.md` | Hồ sơ từng lượt học (append-only) | — |

Cả 3 file chính là markdown, header section = entry. ID không bao giờ tái sử dụng.

## Entry format

```markdown
## P-014 | Hook: câu hỏi first-time + promise cụ thể   (confidence: 2 nguồn)
- Cấu trúc: <công thức mô tả bằng lời, KHÔNG copy câu chữ nguồn>
- Nguồn: <đường dẫn file §mục/dòng> (ngày học), <đường dẫn 2> (ngày học)
- Áp dụng cho TravelFrame: <góc triển khai theo giọng brand>
- Ghi chú: <conflict / superseded / weak-evidence nếu có>
```

- `confidence: N nguồn` — N = số nguồn độc lập xác nhận. Self-exemplar tính là nguồn đáng tin.
- `V-##` bắt buộc ghi nguồn: `self_exemplar` (DESIGN.md, esim caption, scripts Hanoi) hoặc
  nguồn ngoài — nguồn ngoài ghi rõ "chỉ tham khảo cấu trúc, không áp dụng văn phong".
- `I-###`: thêm dòng `- Trạng thái: idea | drafted | archived`.

## Merge rules

1. **Entry mới**: thêm cuối file, ID tiếp theo (đọc ID lớn nhất hiện có + 1; nếu có gap
   thì dùng max+1 — không tái sử dụng ID đã archived).
2. **Pattern lặp lại**: KHÔNG tạo entry mới — tăng confidence, thêm evidence pointer
   vào Nguồn, giữ "ngày học đầu".
3. **Conflict**: giữ CẢ HAI entry, thêm ghi chú `- Ghi chú: conflict với P-XXX về <điểm>
   (ngày)` ở cả hai. Không tự chọn phía; nêu trong báo cáo lượt học để người dùng quyết.
4. **Supersede**: chỉ khi có căn cứ mới (nguồn mạnh hơn/engagement số liệu). Entry cũ thêm
   `- Ghi chú: superseded bởi P-XXX (ngày)` + đổi trạng thái, KHÔNG xóa. Entry mới ghi
   `- Ghi chú: supersede P-YYY`.
5. **Archived**: ý tưởng hết tính thời sự → `- Trạng thái: archived`, giữ nguyên thân.
6. Mọi thay đổi phải xuất hiện trong `runs/<lượt-học>/learning.md` kèm lý do.

## Evidence pointer format

`<đường-dẫn-từ-gốc-workspace>§<mục-hoặc-dòng>` — ví dụ:
- `Research-Insights/Library/analysis/youtube/jnqxac9ivrw/run-1/analysis.md§3-Hook`
- `Marketing-Growth/Content/Review/Legacy-Posts/vietnam-esim-reel-caption.md` (self_exemplar, 2026-09-11)

Pointer phải trỏ tới file THẬT. Entry thiếu pointer → bị từ chối khi merge (test
`test_knowledge_schema.py` kiểm tra schema này).

## Voice playbook layout (seed khởi tạo)

Sections cố định: `Giọng & xưng hô` | `Cấu trúc câu` | `Emoji & ký hiệu` | `CTA chuẩn` |
`Hashtag & ký tên` | `Cấm (guardrails)`. Entry V-## nằm trong section tương ứng.
Seed nguồn: DESIGN.md (guardrails: không claim chưa xác minh, không hứa Train Street,
market B-roll naming, save/share + tên brand), esim caption (trap→move, emoji vừa phải,
comment-CTA + DM), scripts Hanoi (câu ngắn, pro-move line, save + send CTA).
