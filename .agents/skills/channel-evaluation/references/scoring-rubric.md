# Scoring rubric — 10 điểm, chấm kép adversarial

## Schema file scores (rater A/B)

```json
{"rater": "A", "posts": [
  {"post_id": "396...", "url": "https://www.instagram.com/p/DcOX3hWFiey/",
   "scores": {
     "hook":       {"score": 0-2, "evidence": "post id + quan sát cụ thể"},
     "structure":  {"score": 0-2, "evidence": "..."},
     "cta":        {"score": 0-2, "evidence": "..."},
     "caption":    {"score": 0-2, "evidence": "..."},
     "production": {"score": 0-2, "evidence": "chưa xem hình nếu không có analysis run"}
   }}]}
```

## Criteria (0-2 mỗi cái)

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| **hook** | không có điểm dừng scroll | có nhưng chung chung | cụ thể, promise rõ, phù hợp 0-3s |
| **structure** | không mạch / dài lê thê | có mạch nhưng lộn xộn | mạch rõ, beat dễ theo dõi |
| **cta** | không có CTA | CTA chung chung | CTA cụ thể (save/comment keyword/DM) |
| **caption** | dài lê thê, không craft | đọc được | câu ngắn, hashtag/CTA hợp lý, thực dụng |
| **production** | chưa đánh giá được → GHI evidence "chưa xem hình" và để score 1 max | đủ dùng | visual/overlay/branding rõ (chỉ khi xem được hình từ analysis run) |

Quy tắc production: không bao giờ điểm 2 nếu chưa xem hình; chỉ score khi có
analysis run (video-analyst) hoặc evidence từ spot-check.

## Quy trình 2 lượt (blind scoring)

- PASS 1 (rater A): duyệt theo thời gian cũ→mới, chấm từng post.
- PASS 2 (rater B): đọc lại rubric, duyệt ĐẢO NGƯỢC (mới→cũ), KHÔNG nhìn pass 1.
- `merge_scores.py`: |Δ| ≤1 → final = round-half-up((a+b)/2); |Δ| >1 → `unresolved`,
  giữ cả hai. Evidence thiếu → unresolved + đếm vào `missing_evidence`.

## Diễn giải

- Tổng 0-10 chỉ có nghĩa khi ≥80% criteria resolved; nhiều unresolved → report
  trạng thái `partial` + nêu điểm chưa thống nhất.
- Cấm gọi trung bình unresolved.
- Nối với metrics: post top rel_er có pattern gì, bottom thiếu gì — tương quan thôi.
