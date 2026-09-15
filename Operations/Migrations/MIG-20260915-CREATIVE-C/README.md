# MIG-20260915-CREATIVE-C

## Mapping

- `Source video/` -> `Creative-Production/Assets/Raw/` (nguyên trạng, giữ nguyên
  cấu trúc thư mục con `ins pic 1/` và toàn bộ filename — không đổi tên trong batch).

## Rules

Raw media KHÔNG đưa vào Git (`.gitignore` đã che `Creative-Production/Assets/Raw/`).
Git chỉ theo dõi manifest, README và validation report của batch này.

## Rollback

So checksum destination với `manifest.tsv`, move từng file về old path khi old path
chưa tồn tại; không dùng `git reset --hard`.
