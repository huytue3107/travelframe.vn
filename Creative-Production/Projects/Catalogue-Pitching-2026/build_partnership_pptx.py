from __future__ import annotations

from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "Creative-Production" / "Deliverables" / "PPTX" / "TravelFrame-Media-Kit-B2B-Partnership-Proposal-2026.pptx"
ASSETS = ROOT / "Creative-Production" / "Deliverables" / "Catalogue" / "assets"

TEAL = RGBColor(0, 138, 163)
DARK_TEAL = RGBColor(0, 89, 107)
NAVY = RGBColor(15, 23, 42)
SLATE = RGBColor(30, 41, 59)
MUTED = RGBColor(100, 116, 139)
LIGHT_BG = RGBColor(241, 245, 249)
WHITE = RGBColor(255, 255, 255)
BORDER_COLOR = RGBColor(226, 232, 240)


def create_deck() -> Presentation:
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs


def add_blank_slide(prs: Presentation):
    blank_layout = prs.slide_layouts[6]
    return prs.slides.add_slide(blank_layout)


def set_slide_background(slide, color: RGBColor):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_header(slide, badge: str, title: str, subtitle: str = ""):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.7), Inches(1.2))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    p_badge = tf.paragraphs[0]
    p_badge.text = badge.upper()
    p_badge.font.name = "Arial"
    p_badge.font.size = Pt(11)
    p_badge.font.bold = True
    p_badge.font.color.rgb = TEAL

    p_title = tf.add_paragraph()
    p_title.text = title
    p_title.font.name = "Arial"
    p_title.font.size = Pt(21)
    p_title.font.bold = True
    p_title.font.color.rgb = NAVY
    p_title.space_before = Pt(3)

    if subtitle:
        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(11.5)
        p_sub.font.color.rgb = MUTED
        p_sub.space_before = Pt(2)


# ==========================================
# SLIDE 1: TRANG BÌA B2B
# ==========================================
def build_slide_1(prs: Presentation):
    slide = add_blank_slide(prs)
    set_slide_background(slide, NAVY)

    hero_img = ASSETS / "hero-cover.jpg"
    if hero_img.exists():
        slide.shapes.add_picture(str(hero_img), Inches(0), Inches(0), width=Inches(13.333), height=Inches(7.5))

    overlay = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.2), Inches(1.1), Inches(10.9), Inches(5.3))
    overlay.fill.solid()
    overlay.fill.fore_color.rgb = NAVY
    overlay.line.color.rgb = TEAL
    overlay.line.width = Pt(1.5)

    tf = overlay.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.7)

    p0 = tf.paragraphs[0]
    p0.text = "TRAVELFRAME HANOI — CHƯƠNG TRÌNH HỢP TÁC DOANH NGHIỆP 2026"
    p0.font.name = "Arial"
    p0.font.size = Pt(12)
    p0.font.bold = True
    p0.font.color.rgb = RGBColor(56, 189, 248)

    p1 = tf.add_paragraph()
    p1.text = "Hồ Sơ Năng Lực Truyền Thông (Media Kit)\n& Đề Xuất Hợp Tác B2B Phát Triển Du Lịch Quốc Tế"
    p1.font.name = "Arial"
    p1.font.size = Pt(27)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_before = Pt(12)

    p2 = tf.add_paragraph()
    p2.text = "Cầu nối trực tiếp đưa hơn 27.000 du khách quốc tế mỗi tháng đến với Khách sạn, Quán Cafe, Làng nghề & Doanh nghiệp của bạn."
    p2.font.name = "Arial"
    p2.font.size = Pt(13.5)
    p2.font.color.rgb = RGBColor(226, 232, 240)
    p2.space_before = Pt(12)

    p3 = tf.add_paragraph()
    p3.text = "🤝 15% Hoa Hồng Booking   •   ☕ Dẫn Luồng Khách Đều Đặn Hàng Tuần   •   🎬 Tài Trợ Hình Ảnh/Video Chuyên Nghiệp"
    p3.font.name = "Arial"
    p3.font.size = Pt(11)
    p3.font.bold = True
    p3.font.color.rgb = TEAL
    p3.space_before = Pt(18)


# ==========================================
# SLIDE 2: THÔNG SỐ TRUYỀN THÔNG (MEDIA KIT)
# ==========================================
def build_slide_2(prs: Presentation):
    slide = add_blank_slide(prs)
    set_slide_background(slide, LIGHT_BG)
    add_header(slide, "Hồ Sơ Năng Lực & Hiệu Suất", "Thông Số Đo Lường Thực Tế Mạng Xã Hội TravelFrame", "Sức mạnh phân phối tự nhiên đưa hình ảnh các điểm đến Hà Nội chạm tới hàng chục ngàn du khách quốc tế.")

    stat_cards = [
        ("41.921+", "Lượt Xem Video (Reels)", "Thuật toán liên tục phân phối mạnh mẽ tới tệp người dùng đang lên kế hoạch du lịch Hà Nội.", Inches(0.8)),
        ("27.370+", "Tài Khoản Tiếp Cận", "Khả năng mở rộng nhận diện liên tục cho các điểm đến, quán ăn và dịch vụ liên kết.", Inches(3.8)),
        ("98,7%", "Khán Giả Ngoài Kênh", "Cực kỳ đắt giá cho đối tác: Tiếp cận trực tiếp du khách quốc tế mới đặt chân tới Việt Nam.", Inches(6.8)),
        ("~1.700", "Lượt Tương Tác Thực Chất", "Khán giả lưu bài, chia sẻ kinh nghiệm, hỏi đường, hỏi quán ăn ngon và lịch trình cụ thể.", Inches(9.8)),
    ]

    for val, label, desc, left in stat_cards:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.9), Inches(2.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = val
        p.font.name = "Arial"
        p.font.size = Pt(25)
        p.font.bold = True
        p.font.color.rgb = DARK_TEAL

        p_lbl = tf.add_paragraph()
        p_lbl.text = label.upper()
        p_lbl.font.name = "Arial"
        p_lbl.font.size = Pt(10.5)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = SLATE
        p_lbl.space_before = Pt(4)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = MUTED
        p_d.space_before = Pt(6)

    # Hệ sinh thái đa kênh
    b_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.5), Inches(11.7), Inches(2.4))
    b_card.fill.solid()
    b_card.fill.fore_color.rgb = WHITE
    b_card.line.color.rgb = TEAL
    tf_b = b_card.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = Inches(0.3)

    p_bt = tf_b.paragraphs[0]
    p_bt.text = "🌐 Mạng Lưới Kênh Mạng Xã Hội Đa Nền Tảng Của TravelFrame"
    p_bt.font.name = "Arial"
    p_bt.font.size = Pt(13.5)
    p_bt.font.bold = True
    p_bt.font.color.rgb = NAVY

    channels_text = [
        "• 📸 Instagram (@travelframe.vn): Kênh lõi video ngắn Reels & hình ảnh nghệ thuật tiếp cận hơn 41.900+ views/tháng.",
        "• 📘 Facebook Fanpage (TravelFrame Hanoi): Kênh kết nối cộng đồng expat, cập nhật thông tin tour và hỗ trợ khách hàng.",
        "• 🎵 TikTok & 🧵 Threads (@travelframe.vn): Bắt trọn xu hướng ẩm thực ngõ nhỏ, cẩm nang du lịch vi mô và giải đáp thắc mắc.",
        "• 🌐 Website & SEO Hub (travelframe.sidevn.com): Hệ sinh thái bài viết cẩm nang chuyên sâu thu hút hàng ngàn lượt tìm kiếm organic mỗi tháng."
    ]
    for ct in channels_text:
        p = tf_b.add_paragraph()
        p.text = ct
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = SLATE
        p.space_before = Pt(5)


# ==========================================
# SLIDE 3: CHÂN DUNG KHÁCH HÀNG
# ==========================================
def build_slide_3(prs: Presentation):
    slide = add_blank_slide(prs)
    set_slide_background(slide, LIGHT_BG)
    add_header(slide, "Tệp Khách Hàng Mục Tiêu", "Du Khách Quốc Tế Văn Minh Với Sức Chi Tiêu Cao", "Tệp khách hàng của TravelFrame chính là nhóm khách hàng lý tưởng mà mọi doanh nghiệp du lịch đều muốn thu hút.")

    demographics = [
        ("🌏 Nguồn Khách Quốc Tế", "Trên 80% đến từ Úc, Mỹ, Anh, Khối Liên minh Châu Âu, Singapore, Đài Loan, Hàn Quốc. Trí thức, lịch sự và văn minh.", Inches(0.8)),
        ("👥 Độ Tuổi 23 - 40", "Thế hệ Millennials, nữ du lịch một mình, cặp đôi tuần trăng mật, content creators và nhóm bạn trẻ đam mê văn hóa.", Inches(4.8)),
        ("💳 Sức Chi $75 - $290 USD", "Sẵn sàng chi trả từ 1,95 triệu đến 7,5 triệu VNĐ cho trải nghiệm riêng tư; yêu thích dịch vụ chất lượng và đồ thủ công tinh xảo.", Inches(8.8)),
    ]

    for title, desc, left in demographics:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.9), Inches(3.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.3)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = DARK_TEAL

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = SLATE
        p_d.space_before = Pt(8)

    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.5), Inches(11.7), Inches(2.4))
    box.fill.solid()
    box.fill.fore_color.rgb = WHITE
    box.line.color.rgb = TEAL
    tf_box = box.text_frame
    tf_box.word_wrap = True
    tf_box.margin_left = tf_box.margin_right = tf_box.margin_top = Inches(0.3)

    p_t = tf_box.paragraphs[0]
    p_t.text = "💡 Thói Quen Tiêu Dùng & Hành Vi Của Du Khách TravelFrame"
    p_t.font.name = "Arial"
    p_t.font.size = Pt(13.5)
    p_t.font.bold = True
    p_t.font.color.rgb = NAVY

    bullets = [
        "• Tìm Kiếm Không Gian Ẩn Giấu (Hidden Gems): Chủ động tránh xa các điểm du lịch xô bồ, thích quán cà phê ban công, tiệm ăn gia truyền và xưởng thủ công.",
        "• Lan Tỏa Hình Ảnh Mạnh Mẽ: Rất tích cực chia sẻ ảnh và video lên Instagram, TikTok, để lại đánh giá 5 sao trên Google Maps và TripAdvisor.",
        "• Ủng Hộ Văn Hóa Bản Địa: Sẵn sàng chi tiền mua sản phẩm thủ công mỹ nghệ, lụa tơ tằm, gốm sứ và cà phê đặc sản về làm quà kỷ niệm."
    ]
    for b in bullets:
        p = tf_box.add_paragraph()
        p.text = b
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.color.rgb = SLATE
        p.space_before = Pt(6)


# ==========================================
# SLIDE 4: CONTENT WIN LÀM BẰNG CHỨNG (CASE STUDIES)
# ==========================================
def build_slide_4(prs: Presentation):
    slide = add_blank_slide(prs)
    set_slide_background(slide, LIGHT_BG)
    add_header(slide, "Điểm Mạnh & Bằng Chứng Thực Tế", "Content Win Của TravelFrame Là Bệ Phóng Dẫn Khách Cho Đối Tác", "Khách du lịch quốc tế tin tưởng tuyệt đối vào các gợi ý hữu ích của TravelFrame để chọn dịch vụ đối tác.")

    cases = [
        (
            "🎬 Case Study 1: Video '5 Tourist Scams in Hanoi'",
            "14.900 Views • 126 Shares",
            "Tạo dựng niềm tin tuyệt đối với du khách quốc tế. Khách chủ động lưu video và tin tưởng 100% vào các quán ăn, khách sạn và dịch vụ được TravelFrame khuyên dùng.",
            "Tác động đối tác: Khách hàng tìm đến các đối tác của TravelFrame để đảm bảo không bị 'chặt chém'.",
            Inches(0.8)
        ),
        (
            "🎬 Case Study 2: Video 'Train Street Quick Guide'",
            "4.400 Views • Tỷ lệ Share 1,82%",
            "Khả năng điều hướng du khách thực tế cực mạnh. Chỉ dẫn khách tránh bẫy cò mồi và dẫn thẳng khách vào đúng quán cà phê đối tác an toàn, view đẹp trên tầng 2.",
            "Tác động đối tác: Đảm bảo doanh thu cà phê ổn định và lượng khách ghé quán văn minh, đều đặn.",
            Inches(4.8)
        ),
        (
            "🎬 Case Study 3: Video 'POV: Secret Alleys & Coffee'",
            "7.300 Views • 24 Bình luận hỏi quán",
            "Khơi gợi khao khát khám phá trải nghiệm ngõ nhỏ và cà phê trứng. Du khách nhắn tin hỏi trực tiếp địa chỉ quán để đến trải nghiệm trong chuyến đi.",
            "Tác động đối tác: Quán cà phê đối tác được quảng bá miễn phí tới hàng chục ngàn du khách quốc tế.",
            Inches(8.8)
        ),
    ]

    for title, metric, desc, impact, left in cases:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.9), Inches(3.7), Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = TEAL

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.3)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = DARK_TEAL

        p_m = tf.add_paragraph()
        p_m.text = metric
        p_m.font.name = "Arial"
        p_m.font.size = Pt(11)
        p_m.font.bold = True
        p_m.font.color.rgb = TEAL
        p_m.space_before = Pt(4)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = SLATE
        p_d.space_before = Pt(10)

        p_i = tf.add_paragraph()
        p_i.text = f"🎯 {impact}"
        p_i.font.name = "Arial"
        p_i.font.size = Pt(10.5)
        p_i.font.bold = True
        p_i.font.color.rgb = DARK_TEAL
        p_i.space_before = Pt(12)


# ==========================================
# SLIDE 5: 5 MÔ HÌNH HỢP TÁC B2B
# ==========================================
def build_slide_5(prs: Presentation):
    slide = add_blank_slide(prs)
    set_slide_background(slide, LIGHT_BG)
    add_header(slide, "Gói Đề Xuất Hợp Tác", "Năm Mô Hình Hợp Tác B2B Cụ Thể Cùng Doanh Nghiệp", "Được thiết kế linh hoạt nhằm gia tăng doanh thu, tối ưu lượng khách và quảng bá thương hiệu cho đối tác.")

    offers = [
        ("🏨 Khách Sạn Boutique & Homestay", "• Hoa hồng 15% booking (280.000 - 1.100.000 VNĐ / booking)\n• Tăng đánh giá 5 sao xuất sắc trên TripAdvisor & Booking.com\n• Tặng gói chụp ảnh phòng nghỉ miễn phí ($200 USD) sau mỗi 5 booking", Inches(0.8)),
        ("☕ Quán Cà Phê & Nhà Hàng", "• Trở thành 'Điểm Dừng Chân Chính Thức' trong tour hàng tuần\n• Dẫn luồng khách quốc tế đều đặn (nhóm 1-3 người lịch sự)\n• Tặng bộ ảnh đồ uống chuẩn tạp chí để quán dùng trên Google Maps", Inches(4.8)),
        ("🏺 Làng Nghề & Xưởng Thủ Công", "• Đưa vào gói tour khám phá cả ngày Cultural Odyssey ($290 USD)\n• Quay dựng phim tài liệu ngắn nghệ thuật tôn vinh tay nghề nghệ nhân\n• Tiếp cận trực tiếp du khách quốc tế có nhu cầu mua sắm cao", Inches(8.8)),
    ]

    for title, desc, left in offers:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.9), Inches(3.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = DARK_TEAL

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = SLATE
        p_d.space_before = Pt(5)

    offers2 = [
        ("👗 Cửa Hàng Thuê Cổ Phục & Áo Dài", "• Điểm thuê trang phục độc quyền cho khách gói Heritage Hanoi & In Style\n• Tặng bộ ảnh lookbook thời trang chuyên nghiệp với mẫu là khách quốc tế\n• Hưởng chiết khấu hoa hồng hai chiều linh hoạt", Inches(0.8), Inches(5.6)),
        ("✈️ Hãng Lữ Hành Inbound (Tour Operators)", "• Đối tác gia công hình ảnh & video ngắn Reels (Ground Visual Host) cho đoàn khách VIP\n• Chiết khấu sỉ B2B 25% - 30% cho các hợp đồng booking định kỳ\n• Cam kết SLA khắt khe: 24h có sneak peek, dịch vụ White-label bảo mật thương hiệu", Inches(6.8), Inches(5.7)),
    ]

    for title, desc, left, width in offers2:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(4.5), width, Inches(2.4))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = TEAL

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.color.rgb = DARK_TEAL

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = SLATE
        p_d.space_before = Pt(5)


# ==========================================
# SLIDE 6: CÁC CẤP ĐỘ ĐỐI TÁC
# ==========================================
def build_slide_6(prs: Presentation):
    slide = add_blank_slide(prs)
    set_slide_background(slide, LIGHT_BG)
    add_header(slide, "Khung Hợp Tác Thương Mại", "Bảng Phân Hạng Cấp Độ Đối Tác & Quyền Lợi Tài Chính", "Không phát sinh chi phí rủi ro ban đầu. Cùng chia sẻ giá trị và cùng tăng trưởng doanh thu.")

    tiers = [
        ("Tier 1: Cộng Tác Viên Địa Phương\n(Community Affiliate)", "0 VNĐ (Miễn Phí)", "• Đặt Standee QR / Brochure tại sảnh lễ tân\n• Xuất hiện trên danh mục đối tác website", "Nhận ngay 15% Hoa Hồng\n(280.000 - 1.100.000 VNĐ / booking)", Inches(0.8)),
        ("Tier 2: Điểm Dừng Chân Cố Định\n(Featured Stop Partner)", "0 VNĐ (Miễn Phí)", "• Trở thành điểm dừng chân cố định trong tour\n• Nhận bộ ảnh chụp không gian/món ăn tạp chí\n• Gắn thẻ trên các video Reels/TikTok triệu view", "Cam kết lượng khách quốc tế\nđều đặn hàng tuần", Inches(4.8)),
        ("Tier 3: Đồng Thương Hiệu Chiến Lược\n(Strategic Co-Branding)", "Thỏa Thuận", "• 01 Video Review chuyên sâu trên Reels/TikTok\n• 01 Bài viết PR chuẩn SEO trên website\n• Đặt logo trong Guest Guide PDF gửi 100% khách", "Hợp tác truyền thông &\nchia sẻ doanh thu chiến lược", Inches(8.8)),
    ]

    for name, fee, perks, financial, left in tiers:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.9), Inches(3.7), Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = TEAL
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.3)

        p1 = tf.paragraphs[0]
        p1.text = name
        p1.font.name = "Arial"
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = DARK_TEAL

        p_f = tf.add_paragraph()
        p_f.text = f"Phí tham gia: {fee}"
        p_f.font.name = "Arial"
        p_f.font.size = Pt(11.5)
        p_f.font.bold = True
        p_f.font.color.rgb = RGBColor(16, 185, 129) if "Miễn Phí" in fee else TEAL
        p_f.space_before = Pt(6)

        p_pk_title = tf.add_paragraph()
        p_pk_title.text = "Quyền Lợi Truyền Thông:"
        p_pk_title.font.name = "Arial"
        p_pk_title.font.size = Pt(11)
        p_pk_title.font.bold = True
        p_pk_title.font.color.rgb = SLATE
        p_pk_title.space_before = Pt(12)

        p_pk = tf.add_paragraph()
        p_pk.text = perks
        p_pk.font.name = "Arial"
        p_pk.font.size = Pt(10)
        p_pk.font.color.rgb = MUTED
        p_pk.space_before = Pt(4)

        p_fn_title = tf.add_paragraph()
        p_fn_title.text = "Lợi Ích Tài Chính:"
        p_fn_title.font.name = "Arial"
        p_fn_title.font.size = Pt(11)
        p_fn_title.font.bold = True
        p_fn_title.font.color.rgb = SLATE
        p_fn_title.space_before = Pt(12)

        p_fn = tf.add_paragraph()
        p_fn.text = financial
        p_fn.font.name = "Arial"
        p_fn.font.size = Pt(10.5)
        p_fn.font.bold = True
        p_fn.font.color.rgb = DARK_TEAL
        p_fn.space_before = Pt(4)


# ==========================================
# SLIDE 7: QUY TRÌNH 3 BƯỚC & LIÊN HỆ
# ==========================================
def build_slide_7(prs: Presentation):
    slide = add_blank_slide(prs)
    set_slide_background(slide, NAVY)

    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.2))
    tf = tb.text_frame
    p0 = tf.paragraphs[0]
    p0.text = "QUY TRÌNH KÝ KẾT & LIÊN HỆ ĐỐI TÁC"
    p0.font.name = "Arial"
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = RGBColor(56, 189, 248)

    p1 = tf.add_paragraph()
    p1.text = "Ba Bước Nhanh Chóng Để Khởi Động Hợp Tác"
    p1.font.name = "Arial"
    p1.font.size = Pt(23)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p1.space_before = Pt(3)

    steps = [
        ("Bước 1: Khảo Sát & Trao Đổi", "Đội ngũ TravelFrame ghé thăm trực tiếp không gian của quý đối tác để thẩm định dịch vụ và thống nhất phong cách kết nối.", Inches(0.8)),
        ("Bước 2: Bàn Giao Ấn Phẩm", "Bàn giao Standee QR, Brochure trưng bày và thực hiện buổi chụp thử nghiệm không gian/sản phẩm miễn phí.", Inches(4.8)),
        ("Bước 3: Đón Khách & Đối Soát", "Bắt đầu đón du khách quốc tế hoặc ghi nhận booking. Đối soát hoa hồng minh bạch vào ngày 05 hàng tháng qua ngân hàng.", Inches(8.8)),
    ]

    for title, desc, left in steps:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.9), Inches(3.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = SLATE
        card.line.color.rgb = TEAL
        tf_s = card.text_frame
        tf_s.word_wrap = True
        tf_s.margin_left = tf_s.margin_right = tf_s.margin_top = Inches(0.3)

        p = tf_s.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = RGBColor(56, 189, 248)

        p_d = tf_s.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = RGBColor(226, 232, 240)
        p_d.space_before = Pt(8)

    cta = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.6), Inches(11.7), Inches(2.3))
    cta.fill.solid()
    cta.fill.fore_color.rgb = DARK_TEAL
    cta.line.color.rgb = RGBColor(56, 189, 248)
    tf_c = cta.text_frame
    tf_c.word_wrap = True
    tf_c.margin_left = tf_c.margin_right = tf_c.margin_top = Inches(0.4)

    p_c1 = tf_c.paragraphs[0]
    p_c1.text = "Cùng TravelFrame Nâng Tầm Trải Nghiệm Du Lịch Hà Nội"
    p_c1.font.name = "Arial"
    p_c1.font.size = Pt(18)
    p_c1.font.bold = True
    p_c1.font.color.rgb = WHITE

    p_c2 = tf_c.add_paragraph()
    p_c2.text = "Gia nhập mạng lưới các khách sạn boutique, quán cà phê, nghệ nhân và đơn vị lữ hành uy tín hàng đầu thủ đô."
    p_c2.font.name = "Arial"
    p_c2.font.size = Pt(11)
    p_c2.font.color.rgb = RGBColor(226, 232, 240)
    p_c2.space_before = Pt(4)

    p_c3 = tf_c.add_paragraph()
    p_c3.text = "📞 Hotline / Zalo Đối Tác: +84 (0) 904 888 644   •   ✉️ Email: partners@travelframe.vn   •   🌐 Website: travelframe.sidevn.com"
    p_c3.font.name = "Arial"
    p_c3.font.size = Pt(12)
    p_c3.font.bold = True
    p_c3.font.color.rgb = RGBColor(255, 224, 80)
    p_c3.space_before = Pt(12)


def main():
    prs = create_deck()
    build_slide_1(prs)
    build_slide_2(prs)
    build_slide_3(prs)
    build_slide_4(prs)
    build_slide_5(prs)
    build_slide_6(prs)
    build_slide_7(prs)
    prs.save(str(OUTPUT))
    print(f"Successfully generated Vietnamese B2B Partnership Proposal PPTX at: {OUTPUT}")


if __name__ == "__main__":
    main()
