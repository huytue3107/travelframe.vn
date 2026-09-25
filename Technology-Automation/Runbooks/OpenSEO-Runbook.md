# Runbook: OpenSEO Platform & Agent Intelligence

## 1. Tổng Quan

OpenSEO là nền tảng tình báo SEO (SEO Intelligence Platform) mã nguồn mở của TravelFrame, thay thế các giải pháp SaaS đắt đỏ như Semrush ($139/tháng) hay Ahrefs ($129/tháng) bằng mô hình chi trả theo thực dùng (pay-as-you-go) qua DataForSEO.

- **Vị trí mã nguồn:** `Technology-Automation/Tools/open-seo`
- **Bộ phận quản lý:** `Technology-Automation/` (hạ tầng, MCP, skills)
- **Bộ phận khai thác:** `Marketing-Growth/` (từ khóa, audit, bài viết blog, backlinks)
- **Hệ thống Agent hỗ trợ:** Antigravity IDE, Claude Code, Codex, Cursor

---

## 2. Kiến Trúc & Các Thành Phần

```
┌─────────────────────────────────────────────────────────────┐
│                 TravelFrame Company OS                      │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               9 SEO Agent Skills                    │   │
│   │   (.claude/skills/  &  .agents/skills/)             │   │
│   │   • seo-project-setup      • keyword-research       │   │
│   │   • seo-audit              • keyword-clustering     │   │
│   │   • competitor-analysis    • link-prospecting       │   │
│   │   • competitive-landscape  • local-seo              │   │
│   │   • seo-coach                                       │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │ MCP Protocol                 │
│   ┌──────────────────────────┴──────────────────────────┐   │
│   │                 OpenSEO Engine                      │   │
│   │   (Technology-Automation/Tools/open-seo)            │   │
│   │   • Self-hosted / Hosted Endpoint                   │   │
│   │   • DataForSEO API (SERP, Keywords, Backlinks)      │   │
│   │   • Web Dashboard UI                                │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Cấu Hình & Môi Trường

### 3.1. API Credentials cần thiết

| Biến môi trường | Mục đích | Bắt buộc | Cách lấy |
|---|---|---|---|
| `DATAFORSEO_API_KEY` | Dữ liệu Google Search, từ khóa, volume, backlinks | Có (khi crawl data thật) | Đăng ký tại [DataForSEO](https://dataforseo.com/). Format base64: `printf '%s' 'LOGIN:PASSWORD' \| base64` |
| `OPENROUTER_API_KEY` | Tính năng AI Agent SAM bên trong OpenSEO web app | Tùy chọn | Lấy API Key tại [OpenRouter](https://openrouter.ai/keys) |
| `AUTH_MODE` | Chế độ xác thực local | Khuyến nghị | Đặt `local_noauth` khi chạy nội bộ |

### 3.2. Phương thức vận hành

#### Cách 1: Sử dụng OpenSEO Hosted + MCP (Nhanh nhất)
- Truy cập [openseo.so](https://openseo.so) và kết nối tài khoản DataForSEO.
- Sử dụng endpoint MCP chính thức: `https://app.openseo.so/mcp`.

#### Cách 2: Tự Host qua Docker (Khuyên dùng khi có máy chủ/máy trạm)
```bash
cd Technology-Automation/Tools/open-seo
cp .env.example .env
# Điền DATAFORSEO_API_KEY và AUTH_MODE=local_noauth vào .env
docker compose up -d
```
Ứng dụng sẽ chạy tại `http://localhost:3001`. MCP endpoint nội bộ: `http://localhost:3001/mcp`.

---

## 4. Danh Mục 9 SEO Agent Skills

Cả 9 skill đã được cài đặt vào `.claude/skills/` và `.agents/skills/`:

| Skill | Chức năng chính | Lệnh gọi ví dụ |
|---|---|---|
| `seo-project-setup` | Khởi tạo dự án, nạp context kinh doanh của `travelframe.vn` | "Chạy seo-project-setup cho travelframe.vn" |
| `seo-audit` | Crawl và kiểm toán kỹ thuật on-page, xuất báo cáo HTML 1 trang hành động | "Kiểm toán kỹ thuật website travelframe.vn" |
| `keyword-research` | Khám phá từ khóa mới, tìm volume, KD và search intent | "Nghiên cứu từ khóa cho private photo tour Hanoi" |
| `keyword-clustering` | Nhóm từ khóa theo cụm chủ đề để viết bài Pillar & Cluster | "Gom nhóm từ khóa street photography Hanoi" |
| `competitor-analysis` | So sánh trực tiếp backlink, thứ hạng với đối thủ tại Hà Nội | "Phân tích đối thủ tour chụp ảnh Hà Nội trên TripAdvisor" |
| `competitive-landscape` | Lập bản đồ toàn cảnh thị trường tìm kiếm du lịch/nhiếp ảnh | "Đánh giá toàn cảnh đối thủ ngách Hanoi photo tour" |
| `local-seo` | Tối ưu hóa Local SEO, Google Business Profile và NAP consistency | "Tối ưu Local SEO cho TravelFrame tại Hoàn Kiếm" |
| `link-prospecting` | Tìm cơ hội guest post, travel blog và directory chất lượng | "Tìm danh sách blog du lịch tiềm năng để đi backlink" |
| `seo-coach` | Cố vấn chiến lược SEO theo tuần, đề xuất 1 hành động ưu tiên nhất | "Cho tôi lời khuyên SEO tuần này nên làm gì trước" |

---

## 5. Quy Trình Phối Hợp Với Marketing-Growth

1. **Context Dự Án:** File định nghĩa ngữ cảnh của TravelFrame được lưu tại [`Marketing-Growth/Plans/OpenSEO-TravelFrame-Project-Context.md`](file:///Users/macbook/Codex%20GPT/travelframe.vn/Marketing-Growth/Plans/OpenSEO-TravelFrame-Project-Context.md).
2. **Kế Hoạch Viết Bài:** Khi chuẩn bị viết bài mới theo [`SEO-Blog-Content-Briefs.md`](file:///Users/macbook/Codex%20GPT/travelframe.vn/Marketing-Growth/Plans/SEO-Blog-Content-Briefs.md), kích hoạt skill `keyword-research` và `keyword-clustering` để xác thực volume và độ khó thực tế.
3. **Theo Dõi Thứ Hạng:** Định kỳ mỗi tháng, chạy `seo-audit` để phát hiện link hỏng, lỗi thẻ meta, hoặc trang chậm trên `travelframe.vn`.
