from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "Creative-Production" / "Deliverables" / "Docx" / "TravelFrame-Media-Kit-B2B-Partnership-Proposal-2026.docx"

BRAND_TEAL = "008AA3"
DARK_TEAL = "005262"
CHARCOAL = "1F2937"
LIGHT_BG = "F0F8FA"
WARM_GRAY = "F8FAFC"
BORDER_COLOR = "CBD5E1"
WHITE = "FFFFFF"


def set_cell_fill(cell, color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), color)


def set_cell_margins(cell, top=130, start=140, bottom=130, end=140) -> None:
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for edge, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        element = tc_mar.find(qn(f"w:{edge}"))
        if element is None:
            element = OxmlElement(f"w:{edge}")
            tc_mar.append(element)
        element.set(qn("w:w"), str(value))
        element.set(qn("w:type"), "dxa")


def set_table_borders(table, color: str = BORDER_COLOR) -> None:
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = borders.find(qn(f"w:{edge}"))
        if tag is None:
            tag = OxmlElement(f"w:{edge}")
            borders.append(tag)
        tag.set(qn("w:val"), "single")
        tag.set(qn("w:sz"), "4")
        tag.set(qn("w:space"), "0")
        tag.set(qn("w:color"), color)


def set_repeat_table_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_cant_split(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = OxmlElement("w:cantSplit")
    tr_pr.append(cant_split)


def add_inline_runs(paragraph, text: str, base_size: float = 10.5, text_color: str = CHARCOAL) -> None:
    pattern = re.compile(r"(\*\*.+?\*\*|`.+?`)")
    cursor = 0
    for match in pattern.finditer(text):
        if match.start() > cursor:
            run = paragraph.add_run(text[cursor:match.start()])
            run.font.size = Pt(base_size)
            run.font.color.rgb = RGBColor.from_string(text_color)
        token = match.group(0)
        if token.startswith("**"):
            run = paragraph.add_run(token[2:-2])
            run.bold = True
            run.font.size = Pt(base_size)
            run.font.color.rgb = RGBColor.from_string(text_color)
        else:
            run = paragraph.add_run(token[1:-1])
            run.font.name = "Arial"
            run.font.size = Pt(base_size - 0.2)
            run.font.color.rgb = RGBColor.from_string(DARK_TEAL)
            run.bold = True
        cursor = match.end()
    if cursor < len(text):
        run = paragraph.add_run(text[cursor:])
        run.font.size = Pt(base_size)
        run.font.color.rgb = RGBColor.from_string(text_color)


def configure_page(doc: Document) -> None:
    section = doc.sections[0]
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)
    section.page_width = Inches(8.5)
    section.page_height = Inches(11.0)


def configure_styles(doc: Document) -> None:
    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Arial"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(CHARCOAL)
    normal.paragraph_format.space_after = Pt(4)
    normal.paragraph_format.line_spacing = 1.15


def add_header_banner(doc: Document, title: str, subtitle: str, tagline: str) -> None:
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.9)

    cell = table.rows[0].cells[0]
    set_cell_fill(cell, BRAND_TEAL)
    set_cell_margins(cell, top=260, start=260, bottom=240, end=260)

    p_brand = cell.paragraphs[0]
    p_brand.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_brand = p_brand.add_run("TRAVELFRAME HANOI — B2B PARTNERSHIP PROGRAM")
    r_brand.font.name = "Arial"
    r_brand.font.size = Pt(11)
    r_brand.font.bold = True
    r_brand.font.color.rgb = RGBColor.from_string(WHITE)

    p_title = cell.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run(title)
    r_title.font.name = "Arial"
    r_title.font.size = Pt(22)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor.from_string(WHITE)

    p_sub = cell.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run(subtitle)
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(12)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor.from_string(LIGHT_BG)

    p_tag = cell.add_paragraph()
    p_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tag = p_tag.add_run(f"— {tagline} —")
    r_tag.font.name = "Arial"
    r_tag.font.size = Pt(10)
    r_tag.font.color.rgb = RGBColor.from_string(WHITE)


def add_section_title(doc: Document, title: str) -> None:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(title)
    run.font.name = "Arial"
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor.from_string(DARK_TEAL)


def add_callout(doc: Document, text: str, border_color: str = BRAND_TEAL, bg_color: str = LIGHT_BG) -> None:
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.9)

    cell = table.rows[0].cells[0]
    set_cell_fill(cell, bg_color)
    set_cell_margins(cell, top=140, start=160, bottom=140, end=160)

    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "bottom", "right", "insideH", "insideV"):
        tag = borders.find(qn(f"w:{edge}"))
        if tag is None:
            tag = OxmlElement(f"w:{edge}")
            borders.append(tag)
        tag.set(qn("w:val"), "none")

    left_tag = borders.find(qn("w:left"))
    if left_tag is None:
        left_tag = OxmlElement("w:left")
        borders.append(left_tag)
    left_tag.set(qn("w:val"), "single")
    left_tag.set(qn("w:sz"), "24")
    left_tag.set(qn("w:color"), border_color)

    p = cell.paragraphs[0]
    add_inline_runs(p, text, base_size=10.2)


def main() -> None:
    doc = Document()
    configure_page(doc)
    configure_styles(doc)

    # 1. Header Banner
    add_header_banner(
        doc,
        title="2026 Media Kit & B2B Partnership Proposal",
        subtitle="Co-Marketing & High-Value Guest Experiences in Hanoi",
        tagline="Connecting Inbound Travelers with Hanoi's Finest Hospitality & Culture",
    )

    doc.add_paragraph()

    # 2. Executive Overview
    add_section_title(doc, "1. Giới Thiệu Về TravelFrame: Cầu Nối Du Khách Quốc Tế & Trải Nghiệm Bản Địa")
    p_intro = doc.add_paragraph()
    add_inline_runs(
        p_intro,
        "**TravelFrame** là đơn vị tiên phong tại Hà Nội tích hợp giữa **trải nghiệm văn hóa đi bộ cùng người bản địa** và **nhiếp ảnh chuyên nghiệp / video ngắn chất lượng cao (4K Reels & TikTok)** dành riêng cho du khách quốc tế. Chúng tôi giúp du khách không chỉ ngắm nhìn Hà Nội, mà còn lưu giữ toàn bộ hành trình thành những thước phim và hình ảnh nghệ thuật sống động.\n\n"
        "Với mạng lưới tiếp cận rộng khắp hàng chục ngàn du khách quốc tế chuẩn bị và đang có mặt tại Việt Nam, TravelFrame trân trọng gửi lời mời hợp tác tới các **Khách sạn Boutique, Quán Cà phê, Nhà hàng Ẩm thực, Làng nghề truyền thống và Công ty Lữ hành** để cùng tạo dựng những giá trị gia tăng hai chiều bền vững.",
    )

    # 3. Social Media Statistics
    add_section_title(doc, "2. Thông Số Mạng Xã Hội Đầy Đủ (Social Media Footprint & Reach)")
    p_stats = doc.add_paragraph()
    add_inline_runs(p_stats, "Dưới đây là các chỉ số đo lường hiệu suất thực tế trên các kênh truyền thông của TravelFrame trong 30 ngày qua:")

    table_stats = doc.add_table(rows=8, cols=3)
    table_stats.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_stats.autofit = False
    set_table_borders(table_stats)

    stat_widths = [Inches(2.2), Inches(1.8), Inches(2.9)]
    for row in table_stats.rows:
        for i, width in enumerate(stat_widths):
            row.cells[i].width = width

    stat_headers = ["Kênh / Chỉ Số", "Số Liệu Thực Tế", "Ý Nghĩa Đối Với Đối Tác Doanh Nghiệp"]
    for i, h in enumerate(stat_headers):
        cell = table_stats.rows[0].cells[i]
        set_cell_fill(cell, DARK_TEAL)
        set_cell_margins(cell, top=100, start=120, bottom=100, end=120)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor.from_string(WHITE)

    set_repeat_table_header(table_stats.rows[0])

    stat_data = [
        ("**Tổng lượt xem video**\n*(Reels Views)*", "**41.921 views**\n*(30 ngày)*", "Độ phủ thương hiệu du lịch Hà Nội mạnh mẽ, thuật toán Reels liên tục đề xuất tới người dùng quan tâm."),
        ("**Tài khoản tiếp cận**\n*(Accounts Reached)*", "**27.370 accounts**", "Khả năng mở phễu khách hàng mới ấn tượng, đưa hình ảnh điểm đến tiếp cận rộng khắp."),
        ("**Tỷ lệ khán giả ngoài kênh**\n*(Non-Followers)*", "**98,7%**", "**Cực kỳ đắt giá cho đối tác:** Tiếp cận trực tiếp du khách quốc tế mới chuẩn bị hoặc vừa đáp máy bay đến Hà Nội."),
        ("**Lượt tương tác thực chất**\n*(Interactions)*", "**~1.700 lượt**", "Khán giả lưu bài, chia sẻ kinh nghiệm, hỏi đường, hỏi quán ăn ngon và lịch trình cụ thể."),
        ("**Top Video Viral: Scams**\n*(Cảnh báo du lịch)*", "**14.900 views**\n*126 shares*", "Kênh có độ uy tín và tin cậy cao; khách chủ động gửi video cho người thân, bạn bè đồng hành."),
        ("**Top Video: Train Street**\n*(Hướng dẫn an toàn)*", "**4.400 views**\n*(Share rate: 1,82%)*", "Khả năng điều hướng khách thực tế đến đúng các quán cà phê, điểm đến uy tín và an toàn."),
        ("**Độc giả Cẩm nang Website**\n*(SEO Content)*", "**Hàng ngàn lượt đọc**", "Tệp khách nghiên cứu lịch trình kỹ lưỡng thông qua các bài viết chuyên sâu về ẩm thực, khách sạn, văn hóa."),
    ]

    for row_idx, data in enumerate(stat_data, start=1):
        row = table_stats.rows[row_idx]
        set_cant_split(row)
        bg = WARM_GRAY if row_idx % 2 == 1 else WHITE
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            set_cell_fill(cell, bg)
            set_cell_margins(cell, top=80, start=100, bottom=80, end=100)
            p = cell.paragraphs[0]
            add_inline_runs(p, text, base_size=9.8)

    # 4. Audience Profile
    add_section_title(doc, "3. Chân Dung Khách Hàng & Sức Mua Của Du Khách TravelFrame")
    p_aud = doc.add_paragraph()
    add_inline_runs(
        p_aud,
        "• **Quốc gia lưu trú:** Úc, Mỹ, Anh, Khối Liên minh Châu Âu, Singapore, Đài Loan, Hàn Quốc (>80% lượng khách).\n"
        "• **Độ tuổi:** 23 – 40 tuổi (Millennials, Solo female travelers, Cặp đôi trăng mật, Nhóm bạn trẻ trí thức, Digital nomads).\n"
        "• **Khả năng chi tiêu:** Phân khúc trung - cao cấp; sẵn sàng chi từ **$75 USD đến $290 USD** cho các trải nghiệm cá nhân hóa.\n"
        "• **Hành vi du lịch:** Ưa chuộng trải nghiệm văn hóa bản địa chân thực, lịch sự, tôn trọng di sản, tìm kiếm những góc quán đẹp để check-in và chụp ảnh kỷ niệm.",
    )

    # 5. 5 B2B Offers
    add_section_title(doc, "4. Năm Gói Hợp Tác Doanh Nghiệp (B2B Collaboration Offers)")

    offers = [
        (
            "🏨 Gói 1: Dành Cho Khách Sạn Boutique, Homestay & Khách Sạn Phố Cổ (Hotel Concierge Partner)",
            "• **Hoa hồng giới thiệu trực tiếp:** Nhận ngay **15% giá trị tour** (từ **280.000 – 1.100.000 VND / booking**) khi khách lưu trú đặt qua lễ tân hoặc quét mã Standee QR tại phòng.\n"
            "• **Gia tăng điểm đánh giá 5 sao:** Cung cấp thêm một tiện ích trải nghiệm cao cấp giúp khách có chuyến đi đáng nhớ, nâng cao điểm review trên TripAdvisor / Booking.com.\n"
            "• **Tài trợ hình ảnh truyền thông:** Tặng khách sạn **01 gói chụp ảnh không gian / phòng nghỉ miễn phí** (trị giá $200 USD) sau mỗi 5 lượt giới thiệu thành công.",
        ),
        (
            "☕ Gói 2: Dành Cho Quán Cà Phê Đặc Sản, Trà & Ẩm Thực Hà Nội (Curated Rest Stop Partner)",
            "• **Lượng khách quốc tế ổn định hàng tuần:** Quán trở thành điểm dừng chân cố định trong các tour buổi sáng và chiều của TravelFrame (nhóm nhỏ 1-3 khách, văn minh, lịch sự).\n"
            "• **Quảng bá thương hiệu miễn phí:** Quán được xuất hiện, gắn thẻ (tag) trong các video ngắn Reels/TikTok triệu view và các bài viết cẩm nang ẩm thực của TravelFrame.\n"
            "• **Tặng bộ ảnh đồ uống chuẩn tạp chí:** TravelFrame chụp và gửi tặng quán trọn bộ ảnh không gian và món ăn chất lượng cao để quán sử dụng trên Google Maps và fanpage.",
        ),
        (
            "🏺 Gói 3: Dành Cho Làng Nghề Truyền Thống & Workshop Thủ Công (Artisan & Heritage Partner)",
            "• **Đưa vào tour khám phá cả ngày ($290 USD):** Kết nối trực tiếp xưởng gốm Bát Tràng, làng hương Quảng Phú Cầu, xưởng lụa với tệp du khách quốc tế có sức mua cao.\n"
            "• **Sản xuất phim tài liệu ngắn (Cinematic Documentary):** TravelFrame quay dựng những thước phim nghệ thuật tôn vinh bàn tay nghệ nhân và câu chuyện làng nghề, gửi tặng đối tác để làm truyền thông quốc tế.\n"
            "• **Thanh toán vé trải nghiệm minh bạch, sòng phẳng.**",
        ),
        (
            "👗 Gói 4: Dành Cho Cửa Hàng Cho Thuê Cổ Phục & Áo Dài (Heritage Wardrobe Partner)",
            "• **Nguồn khách thuê đều đặn:** TravelFrame ưu tiên chỉ định cửa hàng là điểm thuê trang phục cho khách quốc tế tham gia gói Heritage Hanoi và Hanoi in Style.\n"
            "• **Bộ ảnh Lookbook miễn phí:** Nhận toàn bộ ảnh chụp du khách quốc tế mặc trang phục của quán tại các góc phố di tích Hà Nội để làm tư liệu marketing.\n"
            "• **Chiết khấu hai chiều linh hoạt:** Hưởng hoa hồng khi khách mua thêm phụ kiện hoặc dịch vụ chụp ảnh mở rộng.",
        ),
        (
            "✈️ Gói 5: Dành Cho Công Ty Lữ Hành Inbound & Tour Operators (B2B Visual Fulfillment)",
            "• **Nâng tầm tour lữ hành:** Cung cấp dịch vụ chụp ảnh & quay video Reels 9:16 cho các đoàn khách VIP của công ty lữ hành mà không cần tự duy trì đội media.\n"
            "• **Giá sỉ B2B chiết khấu sâu (25% – 30%):** Áp dụng bảng giá đại lý ưu đãi cho các hợp đồng booking định kỳ.\n"
            "• **Cam kết SLA bảo mật:** Giao ảnh đúng hạn (24h sneak peek, 48h full gallery), dịch vụ chuẩn White-label tôn trọng thương hiệu của công ty lữ hành.",
        ),
    ]

    for title, body in offers:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(8)
        p_t.paragraph_format.space_after = Pt(2)
        r_t = p_t.add_run(title)
        r_t.bold = True
        r_t.font.color.rgb = RGBColor.from_string(DARK_TEAL)
        add_inline_runs(p_t, f"\n{body}", base_size=10.0)

    # 6. Partnership Tiers Table
    add_section_title(doc, "5. Bảng Tổng Hợp Các Cấp Độ Đối Tác (Partnership Tiers)")

    table_tiers = doc.add_table(rows=4, cols=4)
    table_tiers.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_tiers.autofit = False
    set_table_borders(table_tiers)

    tier_widths = [Inches(1.8), Inches(1.5), Inches(2.2), Inches(1.4)]
    for row in table_tiers.rows:
        for i, width in enumerate(tier_widths):
            row.cells[i].width = width

    tier_headers = ["Cấp Độ Đối Tác", "Phí Tham Gia", "Quyền Lợi Truyền Thông & Khách Hàng", "Quyền Lợi Tài Chính"]
    for i, h in enumerate(tier_headers):
        cell = table_tiers.rows[0].cells[i]
        set_cell_fill(cell, BRAND_TEAL)
        set_cell_margins(cell, top=100, start=120, bottom=100, end=120)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor.from_string(WHITE)

    set_repeat_table_header(table_tiers.rows[0])

    tier_data = [
        (
            "**Tier 1: Community Affiliate**\n*(Khách sạn, Homestay)*",
            "**0 VNĐ**\n*(Miễn phí)*",
            "• Đặt Standee QR / Brochure tại sảnh lễ tân\n• Xuất hiện trên danh mục đối tác website",
            "Nhận **15% hoa hồng**\n*(280k - 1,1tr / booking)*",
        ),
        (
            "**Tier 2: Featured Stop Partner**\n*(Quán Cafe, Nhà hàng)*",
            "**0 VNĐ**\n*(Miễn phí)*",
            "• Trở thành điểm dừng chân cố định trong tour\n• Nhận bộ ảnh đồ uống/món ăn tạp chí miễn phí\n• Nhắc tên trên các video Reels review",
            "Cam kết lượng khách\nđều đặn hàng tuần",
        ),
        (
            "**Tier 3: Strategic Co-Branding**\n*(Làng nghề, Thương hiệu lớn)*",
            "**Theo thỏa thuận**\n*(Tài trợ / Trao đổi)*",
            "• 01 Video Review chuyên sâu trên Reels/TikTok\n• 01 Bài PR chuẩn SEO trên website\n• Đặt logo trong Guest Guide PDF gửi 100% khách",
            "Thỏa thuận doanh thu &\nquảng bá truyền thông",
        ),
    ]

    for row_idx, data in enumerate(tier_data, start=1):
        row = table_tiers.rows[row_idx]
        set_cant_split(row)
        bg = WARM_GRAY if row_idx % 2 == 1 else WHITE
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            set_cell_fill(cell, bg)
            set_cell_margins(cell, top=90, start=100, bottom=90, end=100)
            p = cell.paragraphs[0]
            add_inline_runs(p, text, base_size=9.6)

    # 7. 3-Step Onboarding
    add_section_title(doc, "6. Quy Trình Hợp Tác 3 Bước Nhanh Chóng")
    p_step = doc.add_paragraph()
    add_inline_runs(
        p_step,
        "1. **Bước 1 — Khảo sát & Trao đổi:** Team TravelFrame ghé thăm trực tiếp địa điểm của đối tác để trải nghiệm dịch vụ và thống nhất hình thức kết nối phù hợp nhất.\n"
        "2. **Bước 2 — Bàn giao ấn phẩm & Chụp hình:** TravelFrame gửi tặng đối tác bộ Standee QR, Brochure mẫu và thực hiện buổi chụp thử nghiệm không gian.\n"
        "3. **Bước 3 — Đón khách & Đối soát minh bạch:** Bắt đầu đưa khách ghé thăm hoặc tiếp nhận booking; đối soát hoa hồng minh bạch vào ngày 05 hàng tháng qua tài khoản ngân hàng.",
    )

    # 8. Callout & Contact
    add_callout(
        doc,
        "**TravelFrame cam kết:** Hợp tác trên tinh thần tôn trọng lẫn nhau, bảo tồn văn hóa di sản Hà Nội, mang lại những ấn tượng đẹp đẽ nhất cho du khách quốc tế và sự thịnh vượng cho các doanh nghiệp bản địa.",
    )

    p_contact = doc.add_paragraph()
    p_contact.paragraph_format.space_before = Pt(12)
    add_inline_runs(
        p_contact,
        "**LIÊN HỆ PHÒNG PHÁT TRIỂN ĐỐI TÁC (B2B PARTNERSHIPS):**\n"
        "• **Hotline / Zalo / WhatsApp:** `+84 (0) 904 888 644`\n"
        "• **Email Hợp Tác:** `partners@travelframe.vn` / `hello@travelframe.vn`\n"
        "• **Website Chính Thức:** `https://travelframe.sidevn.com`\n"
        "• **Instagram:** `@travelframe.vn`\n"
        "• **Văn Phòng Vận Hành:** Hoàn Kiếm, Hà Nội, Việt Nam.",
    )

    doc.save(str(OUTPUT))
    print(f"Successfully generated B2B Media Kit & Partnership Proposal DOCX at: {OUTPUT}")


if __name__ == "__main__":
    main()
