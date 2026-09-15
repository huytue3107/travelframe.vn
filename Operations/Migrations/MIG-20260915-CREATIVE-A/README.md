# MIG-20260915-CREATIVE-A

## Mapping

- `travelframe-guest-guide/` -> `Creative-Production/Deliverables/Guest-Guide/`
- `output/qa-web-pricing-option1-v1/` -> `Creative-Production/Review/Web-Pricing/qa-web-pricing-option1-v1/`
- `output/qa-web-pricing-option1-v2/` -> `Creative-Production/Review/Web-Pricing/qa-web-pricing-option1-v2/`

## Rules

Giữ nguyên filenames và cấu trúc thư mục con (assets, previews, pdf-previews).
QA previews là bản QA, không được đánh dấu Approved hay Published.

## Rollback

So checksum destination với `manifest.tsv`; move từng bundle về legacy path khi
legacy destination chưa tồn tại; sau đó revert commit của batch.
