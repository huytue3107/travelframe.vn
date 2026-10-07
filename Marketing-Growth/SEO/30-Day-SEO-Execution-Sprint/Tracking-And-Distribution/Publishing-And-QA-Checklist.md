# Publishing & Quality Assurance (QA) Checklist

- **Mã quy trình:** `SOP-202610-SEO-CONTENT-QA`
- **Chủ trì:** Marketing-Growth & Operations
- **Trạng thái:** `Review`
- **Mục tiêu:** Đảm bảo 100% nội dung trước khi xuất bản lên website chính thức (`https://travelframe.vn`) đều đáp ứng chuẩn mực E-E-A-T của Google, tính xác thực dữ liệu và giọng văn thương hiệu TravelFrame.

---

## 1. Kiểm Tra Tính Xác Thực & Chính Sách Thương Hiệu (Factual & Voice QA)

- [ ] **Quy tắc giá (Rule V-08):** Mọi mức giá tour trong bài viết (ví dụ: $80 USD cho gói 2h, $140 USD cho gói 3h) phải khớp chính xác với tài liệu giá đã duyệt tại [`Brand-Strategy/Offers-Pricing/TravelFrame-Website-Packages-Pricing-2026-09-15.md`](file:///Users/macbook/Codex%20GPT/travelframe.vn/Brand-Strategy/Offers-Pricing/TravelFrame-Website-Packages-Pricing-2026-09-15.md). Nếu có khoảng giá dự tính, phải có nhãn `Indicative price`.
- [ ] **An toàn phố đường tàu (Rule V-07 & V-09):** Tuyệt đối không hứa hẹn "100% vào được đường tàu nếu rào chắn đóng". Luôn nhấn mạnh an toàn hành vi, nghe còi tàu và đi cùng chủ quán có thẩm quyền.
- [ ] **Giọng văn người bạn bản địa (Rule V-01 & V-02):**
  - Xưng hô ấm áp, tự nhiên, gần gũi như một người bạn địa phương dẫn đường.
  - Mỗi phần đều có mẹo thực hành đóng khung *"Pro move:"*.
  - Tuyệt đối không dùng các từ sáo rỗng AI (như *tapestry, nestled in the heart of, testament to, delve*).
- [ ] **Chữ ký thương hiệu (Rule V-06):** Kết thúc bài viết bằng câu ký tên chuẩn: *"TravelFrame — your local friend in Hanoi"*.

---

## 2. Kiểm Duyệt Kỹ Thuật SEO Onpage (Technical SEO QA)

- [ ] **Độ dài Title Tag:** Dưới 65 ký tự, chứa từ khoá chính ở đầu và kết thúc bằng `| TravelFrame`.
- [ ] **Độ dài Meta Description:** Từ 140 – 155 ký tự, có từ khoá phụ và lời kêu gọi hành động rõ ràng.
- [ ] **Thẻ tiêu đề (Heading Hierarchy):** Duy nhất một thẻ `H1`, các thẻ `H2` và `H3` phân cấp logic, không nhảy cóc từ H1 xuống H3.
- [ ] **Định dạng URL (Slug):** Viết thường, không dấu, ngăn cách bằng dấu gạch ngang `-`, ngắn gọn và chứa từ khoá mục tiêu.
- [ ] **Thẻ Canonical:** Đã khai báo thẻ `<link rel="canonical" href="..." />` trỏ về URL chính thức.
- [ ] **Mã cấu trúc Schema (JSON-LD):** Đã kiểm tra qua Google Rich Results Test (hợp lệ 100% cho `TravelAgency`, `Service`, `FAQPage`, hoặc `Article`).

---

## 3. Tối Ưu Hình Ảnh & Tốc Độ Tải Trang (Core Web Vitals)

- [ ] **Định dạng ảnh:** 100% hình ảnh minh hoạ được chuyển đổi sang định dạng `WebP` hoặc `AVIF` hiện đại.
- [ ] **Kích thước tệp:** Dung lượng mỗi bức ảnh không vượt quá 200KB.
- [ ] **Thuộc tính Alt Text:** Tất cả ảnh đều có thẻ `alt` miêu tả ngữ cảnh thực tế kèm địa danh Hà Nội (ví dụ: `alt="Solo female traveler sipping egg coffee at Cafe Dinh Hanoi"`).
- [ ] **Khai báo kích thước:** Đầy đủ thuộc tính `width` và `height` trên thẻ `<img>` để tránh xê dịch bố cục (CLS = 0).

---

## 4. Kiểm Thử Đường Dẫn Chuyển Đổi (Conversion & Tracking QA)

- [ ] **Link WhatsApp:** Hoạt động chính xác, mở ứng dụng WhatsApp với tin nhắn mẫu soạn sẵn: `https://wa.me/84981234567?text=Hi%20TravelFrame!%20I'd%20like%20to%20inquire%20about...`
- [ ] **Link Instagram DM:** Trỏ chính xác về hồ sơ `@travelframe.vn`.
- [ ] **Liên kết nội bộ (Internal Links):** Tối thiểu 3–5 liên kết nội bộ theo ma trận [`Internal-Link-Matrix.md`](file:///Users/macbook/Codex%20GPT/travelframe.vn/Marketing-Growth/SEO/30-Day-SEO-Execution-Sprint/Tracking-And-Distribution/Internal-Link-Matrix.md). Không có link gãy (404).

---

## 5. Cổng Phê Duyệt Xuất Bản (Rocky Approval Gate)

> **Theo quy chế `AGENTS.md`:**  
> Mọi nội dung trên đều ở trạng thái `Review`. Việc đẩy bài viết lên môi trường Live của website `https://travelframe.vn` cần có phê duyệt rõ ràng từ **Rocky** trước khi xuất bản.
