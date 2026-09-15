# TravelFrame Skills Architecture & Governance

Hệ thống kỹ năng (Agent Skills) chuẩn hóa cho toàn bộ 9 phòng ban của TravelFrame.

---

## 1. Kiến Trúc Hệ Thống

```text
.agents/skills/ (Canonical Runtime Source)
       |
       |  (Đồng bộ qua sync_skills.py dựa trên skills-manifest.json)
       v
.claude/skills/ (Claude Deployment Mirror)
```

- **Nguồn thực thi chuẩn (Canonical):** `.agents/skills/<skill-name>/` là nơi chứa mã nguồn, tài liệu hướng dẫn và kịch bản gốc.
- **Bản gương triển khai (Mirror):** `.claude/skills/<skill-name>/` là bản copy tự động để phục vụ runtime của Claude Desktop/Claude Code. Không sửa tay bản mirror.
- **Tập trung quản lý (Manifest):** `Technology-Automation/Skills/skills-manifest.json` là single source of truth cho danh mục kỹ năng, trạng thái, phòng ban sở hữu và cổng phê duyệt.

---

## 2. Tài Liệu Thành Phần

- [Catalog.md](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Catalog.md): Danh mục toàn bộ kỹ năng theo phòng ban kèm trigger và output.
- [Governance.md](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Governance.md): Vòng đời kỹ năng, quy trình kiểm định nguồn và tiêu chuẩn an toàn.
- `Departments/`: Hướng dẫn chuyên sâu và kịch bản thực thi cho từng phòng ban:
  - [Executive](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Executive/README.md)
  - [Brand-Strategy](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Brand-Strategy/README.md)
  - [Research-Insights](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Research-Insights/README.md)
  - [Marketing-Growth](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Marketing-Growth/README.md)
  - [Creative-Production](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Creative-Production/README.md)
  - [Sales-CRM](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Sales-CRM/README.md)
  - [Technology-Automation](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Technology-Automation/README.md)
  - [Data-Analytics](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Data-Analytics/README.md)
  - [Operations](file:///Users/macbook/Codex%20GPT/travelframe.vn/Technology-Automation/Skills/Departments/Operations/README.md)

---

## 3. Lệnh Vận Hành & Kiểm Tra

```bash
# Kiểm tra hợp đồng kỹ năng và tính hợp lệ của manifest
python3 Technology-Automation/Scripts/validate_skills.py --root .

# Kiểm tra độ lệch (drift) giữa .agents/skills và .claude/skills
python3 Technology-Automation/Scripts/sync_skills.py --root . --check

# Đồng bộ kỹ năng từ .agents sang .claude
python3 Technology-Automation/Scripts/sync_skills.py --root . --write
```
