#!/usr/bin/env python3
"""
Build TravelFrame Creator Collaboration Strategy Document (.docx)
Output: Marketing-Growth/Plans/2026-09-25-TravelFrame-Creator-Collaboration-Strategy.docx
Complies with TravelFrame styling guidelines: Teal #008AA3, Aptos font, executive tables, callout blocks.
"""

from pathlib import Path
from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "Marketing-Growth" / "Plans" / "2026-09-25-TravelFrame-Creator-Collaboration-Strategy.docx"
OUT.parent.mkdir(parents=True, exist_ok=True)

TEAL = "008AA3"
DARK = "222222"
MUTED = "555555"
LIGHT_GRAY = "F4F6F7"
CALLOUT_BG = "F0F8FA"
BORDER_COLOR = "D9D9D9"


def shade(cell, fill_hex):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill_hex)


def border_cell(cell, top=True, bottom=True, left=True, right=True, color=BORDER_COLOR, sz="6"):
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge, active in [("top", top), ("bottom", bottom), ("left", left), ("right", right)]:
        tag = "w:" + edge
        el = borders.find(qn(tag))
        if el is None:
            el = OxmlElement(tag)
            borders.append(el)
        if active:
            el.set(qn("w:val"), "single")
            el.set(qn("w:sz"), sz)
            el.set(qn("w:space"), "0")
            el.set(qn("w:color"), color)
        else:
            el.set(qn("w:val"), "none")


def format_run(run, bold=False, italic=False, color=DARK, size=10, font_name="Aptos"):
    run.bold = bold
    run.italic = italic
    run.font.name = font_name
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)


def add_p(doc, text="", bold=False, italic=False, color=DARK, size=10, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=4):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if text:
        r = p.add_run(text)
        format_run(r, bold=bold, italic=italic, color=color, size=size)
    return p


def add_callout(doc, title, text):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    c = t.rows[0].cells[0]
    c.width = Inches(6.8)
    shade(c, CALLOUT_BG)
    border_cell(c, top=False, bottom=False, left=True, right=False, color=TEAL, sz="24")
    
    p = c.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    r_title = p.add_run(title + "\n")
    format_run(r_title, bold=True, color=TEAL, size=10.5)
    r_text = p.add_run(text)
    format_run(r_text, color=DARK, size=9.5)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)


def make_styled_table(doc, headers, rows, widths):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    
    # Header row
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        c.width = Inches(widths[i])
        shade(c, TEAL)
        border_cell(c, top=True, bottom=True, left=True, right=True, color=TEAL)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        format_run(r, bold=True, color="FFFFFF", size=9)
        c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

    # Data rows
    for ridx, row in enumerate(rows):
        cells = t.add_row().cells
        bg = "FFFFFF" if ridx % 2 == 0 else LIGHT_GRAY
        for i, val in enumerate(row):
            cells[i].width = Inches(widths[i])
            shade(cells[i], bg)
            border_cell(cells[i], top=True, bottom=True, left=True, right=True, color=BORDER_COLOR)
            p = cells[i].paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.1
            
            # Align center if short text or numeric
            val_str = str(val).strip()
            if any(char.isdigit() for char in val_str) and len(val_str) < 15:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                
            r = p.add_run(val_str)
            format_run(r, color=DARK, size=9)
            cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return t


def build_document():
    doc = Document()

    # Page Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Document Header / Badge
    p_meta = add_p(doc, "TRAVELFRAME VIETNAM • MARKETING & GROWTH STRATEGY", bold=True, color=TEAL, size=9, space_after=2)
    
    # Title
    p_title = add_p(doc, "KẾ HOẠCH CHIẾN LƯỢC BOOKING & HỢP TÁC TRAVEL CREATOR (KOL/KOC) Q4/2026", bold=True, color=DARK, size=18, space_after=4)
    
    # Subtitle
    p_sub = add_p(doc, "Ứng dụng mô hình Creator Collaboration & Content Hook đột phá từ nghiên cứu định lượng thị trường du lịch", italic=True, color=MUTED, size=10.5, space_after=12)

    # Metadata Table
    meta_headers = ["Mã tài liệu", "Phòng ban", "Kỳ áp dụng", "Trạng thái", "Thương hiệu mục tiêu"]
    meta_rows = [
        ["PLN-MKT-20260925-CREATOR-COLLAB", "Marketing & Growth", "Tháng 10 - Tháng 12/2026", "Đề xuất chiến lược (Draft)", "TravelFrame (@travelframe.vn)"]
    ]
    make_styled_table(doc, meta_headers, meta_rows, [1.8, 1.3, 1.4, 1.2, 1.1])

    # Section 1
    add_p(doc, "1. Cơ Sở Thực Tiễn & Phân Tích Benchmark Từ Case Study Tháng 8", bold=True, color=TEAL, size=13, space_before=10, space_after=4)
    
    add_p(doc, "Nghiên cứu đối soát 58 video Reels trong 3 tháng gần nhất (Quý 3/2026) của kênh @trip.best_official (Trip.com) đã chỉ ra một bước nhảy vọt mang tính quyết định trong tháng 08/2026. Khi thương hiệu chuyển đổi từ việc tự đăng tải các video đồ họa in-house sang chiến lược Hợp tác Đồng tác giả (Creator Collaboration Post) cùng các travel creators, hiệu suất toàn kênh đã bùng nổ vượt trội:", space_after=6)

    case_headers = ["Chỉ số đo lường", "Video In-house (49 video)", "Creator Collab (9 video)", "Mức độ chênh lệch"]
    case_rows = [
        ["Lượt xem trung bình (Avg Views)", "34.107 views / reel", "109.951 views / reel", "Creator Collab cao gấp 3,2 lần"],
        ["Lượt thích trung bình (Avg Likes)", "151 likes / reel", "1.012 likes / reel", "Creator Collab cao gấp 6,7 lần"],
        ["Tổng số bình luận (Comments)", "49 comments (9%)", "493 comments (91%)", "Creator Collab chiếm 91% thảo luận"],
        ["Tỷ lệ tương tác sâu (Eng. Rate)", "0,44%", "2,85%", "Gấp 6,5 lần tỷ lệ gắn kết"]
    ]
    make_styled_table(doc, case_headers, case_rows, [1.8, 1.6, 1.6, 1.8])

    add_callout(doc, "Bài học chiến lược cho TravelFrame:", 
                "Khán giả Instagram hiện đại có cơ chế tự nhiên kháng cự lại các quảng cáo thương hiệu một chiều, nhưng lại cực kỳ cởi mở và tin tưởng trải nghiệm của những người sáng tạo nội dung có gu (creators). Đối với dịch vụ Photo Travel Tour bản địa của TravelFrame, việc mời Creator trải nghiệm thực tế và đồng đăng bài (Instagram Collab) sẽ biến Creator thành bằng chứng sống cho chất lượng ảnh và cảm xúc độc bản, mở toang tệp khách hàng tiềm năng mà không tốn chi phí truyền thông truyền thống.")

    # Section 2
    add_p(doc, "2. Mục Tiêu Chiến Lược (Objectives & Key Results - OKRs)", bold=True, color=TEAL, size=13, space_before=10, space_after=4)
    add_p(doc, "Chiến dịch đặt trọng tâm đưa TravelFrame trở thành cái tên dẫn đầu trong phân khúc Photo Tour du lịch trải nghiệm tại Hà Nội và miền Bắc trong mùa cao điểm thu đông:", space_after=4)
    
    okr_headers = ["Nhóm mục tiêu", "Chỉ số then chốt (Target Metric)", "Hạn mốc", "Giá trị kỳ vọng"]
    okr_rows = [
        ["Độ phủ thương hiệu (Reach)", "Tổng lượt xem tích lũy (Total Video Views)", "31/12/2026", "Tối thiểu 1.200.000 views"],
        ["Phát triển tệp người theo dõi", "Tăng trưởng Followers trang @travelframe.vn", "31/12/2026", "Đạt mốc 3.000+ followers chất lượng"],
        ["Mức độ gắn kết cộng đồng", "Lượt bình luận quan tâm dịch vụ (Comments)", "31/12/2026", "Trên 500 bình luận hỏi tour/cẩm nang"],
        ["Tỷ lệ tương tác trung bình", "Engagement Rate trên từng bài Collab", "Hàng tuần", "Duy trì ổn định trên 2,5%"],
        ["Chuyển đổi thương mại (Sales)", "Tin nhắn tư vấn (Inbound Leads) & Bookings", "31/12/2026", "150 leads -> 40 confirmed bookings"]
    ]
    make_styled_table(doc, okr_headers, okr_rows, [1.7, 2.3, 1.1, 1.7])

    # Section 3
    add_p(doc, "3. Phân Tầng Nhà Sáng Tạo Mục Tiêu (Creator Tiers & Personas)", bold=True, color=TEAL, size=13, space_before=10, space_after=4)
    add_p(doc, "Thay vì dàn trải ngân sách cho các KOL quá lớn, TravelFrame áp dụng chiến thuật chia 3 tầng Creator với mục tiêu rõ ràng:", space_after=6)

    tier_headers = ["Phân tầng Creator", "Quy mô Followers", "Chân dung phù hợp", "Hình thức hợp tác", "Số lượng"]
    tier_rows = [
        ["Tier 1: Micro/Nano Local Creators", "5K - 30K", "Người trẻ mê xê dịch, ẩm thực ngõ nhỏ, cà phê ban công phố cổ", "100% Barter: Tặng 1 suất tour 1:1 đổi 1 Reel Collab + Carousel", "12 Creators"],
        ["Tier 2: Solo Travel & Expats", "10K - 80K", "Nữ du khách quốc tế hoặc expat sống tại VN, mê độc hành", "Barter trọn gói kèm hỗ trợ chi phí sản xuất (1,5 - 2 triệu)", "6 Creators"],
        ["Tier 3: Visual & Cinematic Masters", "20K - 100K", "Nhiếp ảnh gia phim, videographer có gu nghệ thuật Vương Gia Vệ", "Booking chuyên nghiệp + Đồng sản xuất visual cao cấp", "3 Creators"]
    ]
    make_styled_table(doc, tier_headers, tier_rows, [1.6, 1.1, 1.9, 1.6, 0.6])

    # Section 4
    add_p(doc, "4. Ma Trận Kịch Bản & 4 Nhóm Hook Đột Phá", bold=True, color=TEAL, size=13, space_before=10, space_after=4)
    add_p(doc, "Kế thừa từ các video đạt tương tác cao nhất của Trip.Best, TravelFrame xây dựng 4 trụ cột kịch bản có tỷ lệ giữ chân người xem cao nhất:", space_after=6)

    pillar_headers = ["Trụ cột nội dung", "Công thức Hook mở đầu (First 3s)", "Nội dung triển khai visual", "Call to Action (CTA)"]
    pillar_rows = [
        ["1. Thực vs Ảo (Unreal Reality)", "\"Nhiều người nghĩ ảnh mùa thu Hà Nội chỉ là chỉnh màu lừa lọc, cho đến khi tự mình dậy lúc 6:00 sáng...\"", "Chuyển cảnh từ cam thường điện thoại sang bức ảnh máy cơ chuẩn ánh sáng ban mai của TravelFrame.", "Bình luận \"MÙA THU\" để nhận lịch trình săn nắng sớm vắng người."],
        ["2. Cứu cánh du khách solo", "\"Bí mật lớn nhất để đi du lịch một mình mà vẫn có cả album ảnh thơ mộng như nàng thơ điện ảnh...\"", "Creator thảnh thơi nhâm nhi cà phê, Photo Guide bản địa hướng dẫn góc chụp và tạo dáng tự nhiên.", "Tag ngay đứa bạn chụp ảnh không có tâm vào đây để nhắc nhở."],
        ["3. Bí mật ngõ ngách bản địa", "\"Tôi không xem danh sách điểm đến trên mạng, tôi chỉ đi theo bước chân anh thợ ảnh bản địa...\"", "Dẫn dắt qua những con ngõ cổ kính, quán nước vỉa hè bình yên không hề xô bồ.", "Lưu lại ngay tọa độ này cho chuyến đi Hà Nội sắp tới."],
        ["4. Giveaway & Lead Magnet", "\"Tặng 5 suất Photo Walk Hà Nội 1:1 miễn phí và cẩm nang bản đồ 20 góc chụp mùa thu đẹp nhất!\"", "Giới thiệu bộ quà tặng voucher và cẩm nang ảnh chụp của TravelFrame.", "Comment \"HANOI\" để hệ thống tự động gửi cẩm nang qua inbox."]
    ]
    make_styled_table(doc, pillar_headers, pillar_rows, [1.5, 2.0, 1.9, 1.4])

    # Section 5
    add_p(doc, "5. Quy Trình Vận Hành 4 Bước Chuẩn Hóa", bold=True, color=TEAL, size=13, space_before=10, space_after=4)
    
    add_p(doc, "• Bước 1: Tiếp cận & Sàng lọc (Outreach & Vetting):", bold=True, color=DARK, size=10.5, space_before=4)
    add_p(doc, "Lọc tương tác thực qua engagement rate (> 3%), gửi lời mời trân trọng bằng văn phong ấm áp của TravelFrame qua tin nhắn riêng, tuyệt đối không dùng mẫu thư thương mại cứng nhắc.", space_after=4)

    add_p(doc, "• Bước 2: Buổi Trải Nghiệm Visual (The Shoot Day):", bold=True, color=DARK, size=10.5, space_before=4)
    add_p(doc, "Tư vấn bảng màu trang phục phù hợp với phố cổ hoặc vùng cao, đồng hành thân thiện như người bạn bản địa. Cam kết trả nhanh 5 đến 10 ảnh preview trong 24 giờ để Creator đăng ngay khi cảm xúc trải nghiệm còn nguyên vẹn.", space_after=4)

    add_p(doc, "• Bước 3: Đồng Xuất Bản Collab Post:", bold=True, color=DARK, size=10.5, space_before=4)
    add_p(doc, "Sử dụng tính năng 'Invite Collaborator' trên Instagram để bài đăng hiển thị song song trên 2 hồ sơ. Canh giờ vàng đăng bài (13:00 - 15:00 hoặc 19:30 - 21:00) và túc trực phản hồi bình luận trong 30 phút đầu tiên.", space_after=4)

    add_p(doc, "• Bước 4: Tự Động Định Tuyến & Chăm Sóc Lead (ManyChat & JEV AI):", bold=True, color=DARK, size=10.5, space_before=4)
    add_p(doc, "Tự động hóa ManyChat bắt từ khóa trong bình luận để gửi cẩm nang chụp ảnh. Mô hình AI jev-latest chấm điểm nhu cầu khách hàng để chuyển giao ngay cho đội ngũ tư vấn chốt lịch đặt tour.", space_after=6)

    # Section 6
    add_p(doc, "6. Dự Toán Ngân Sách & Hiệu Quả Đầu Tư (Budget & ROI)", bold=True, color=TEAL, size=13, space_before=10, space_after=4)

    budget_headers = ["Hạng mục chi phí", "Quy mô triển khai", "Đơn giá dự kiến (VND)", "Tổng thành tiền (VND)", "Tỷ trọng"]
    budget_rows = [
        ["Chi phí trải nghiệm Barter (Photo tour, stylist, cafe)", "15 buổi chụp 1:1", "1.000.000", "15.000.000", "33,3%"],
        ["Thù lao Creator (Tier 2 & Tier 3 hỗ trợ sản xuất)", "6 Creators", "3.500.000", "21.000.000", "46,7%"],
        ["Quà tặng Minigame & Voucher ưu đãi", "20 phần quà", "250.000", "5.000.000", "11,1%"],
        ["Ngân sách Boost quảng cáo đối tác (Partnership Ads)", "3 bài top views", "1.333.333", "4.000.000", "8,9%"],
        ["TỔNG CỘNG DỰ TOÁN CHIẾN DỊCH Q4/2026", "21 Creator hợp tác", "-", "45.000.000", "100%"]
    ]
    make_styled_table(doc, budget_headers, budget_rows, [2.3, 1.2, 1.2, 1.2, 0.9])

    add_callout(doc, "Dự phóng hiệu quả tài chính (ROI Forecast):",
                "Với ngân sách 45 triệu VND, chiến dịch dự kiến mang về tối thiểu 40 booking Photo Tour có trả phí (giá trung bình từ 1.800.000 đến 3.200.000 VND / tour). Doanh thu gộp ước tính đạt từ 72.000.000 đến 128.000.000 VND, mang lại tỷ suất ROI dương từ 160% đến 284%, đồng thời xây dựng được kho tài nguyên hình ảnh và tệp khách hàng tiềm năng lâu dài cho thương hiệu.")

    # Section 7
    add_p(doc, "7. Lộ Trình Triển Khai 12 Tuần Chi Tiết (Q4/2026)", bold=True, color=TEAL, size=13, space_before=10, space_after=4)

    timeline_headers = ["Giai đoạn", "Khoảng thời gian", "Trọng tâm hành động", "Sản phẩm đầu ra"]
    timeline_rows = [
        ["P1: Chuẩn bị & Outreach", "01/10 - 07/10/2026", "Soạn Media Kit, lập danh sách 40 Creator, tạo Ebook cẩm nang bản đồ.", "Danh sách 21 Creator đồng ý tham gia."],
        ["P2: Sản xuất trải nghiệm", "08/10 - 21/10/2026", "Tổ chức 10 buổi chụp thử nghiệm tại phố Phan Đình Phùng, phố cổ.", "10 bộ ảnh visual và raw video clip."],
        ["P3: Đợt sóng 1 (Mùa thu HN)", "22/10 - 11/11/2026", "Đăng tải dồn dập các video Collab Hà Nội, mở đợt Minigame tặng tour.", "Đạt 600K views, thu hút 1.500 followers mới."],
        ["P4: Đợt sóng 2 (Tây Bắc)", "12/11 - 02/12/2026", "Mở rộng nội dung sang mùa hoa tam giác mạch Hà Giang, săn mây Tà Xùa.", "Đạt thêm 600K views, 1.500 followers mới."],
        ["P5: Tối ưu & Chốt tour", "03/12 - 25/12/2026", "Chăm sóc tệp leads chuyển đổi, chốt các tour đón Giáng sinh và Năm mới.", "Hoàn thành chỉ tiêu 40 bookings."]
    ]
    make_styled_table(doc, timeline_headers, timeline_rows, [1.4, 1.4, 2.3, 1.7])

    # Footer note
    add_p(doc, "Tài liệu được khởi tạo và quản trị bởi TravelFrame Marketing & Growth Department • Bản quyền 2026.", italic=True, color=MUTED, size=8.5, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16)

    doc.save(str(OUT))
    print(f"Document successfully created at: {OUT}")


if __name__ == "__main__":
    build_document()
