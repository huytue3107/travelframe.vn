from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / "Creative-Production" / "Deliverables" / "Docx" / "TravelFrame-Customer-Pitching-Catalogue-2026.docx"

BRAND_TEAL = "008AA3"
DARK_TEAL = "005262"
CHARCOAL = "1F2937"
MUTED_TEXT = "4B5563"
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
    r_brand = p_brand.add_run("TRAVELFRAME HANOI")
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
    run.font.size = Pt(15)
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
    left_tag.set(qn("w:sz"), "24")  # thick left bar
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
        title="2026 Customer Pitching Catalogue",
        subtitle="Private Photo Tours & Guided Cultural Experiences in Hanoi",
        tagline="Explore Hanoi with a local expert, preserve your story in cinematic frames",
    )

    doc.add_paragraph()

    # 2. Executive Philosophy
    add_section_title(doc, "1. The TravelFrame Philosophy: Not Just a Tour, Your Personal Story")
    p_phil = doc.add_paragraph()
    add_inline_runs(
        p_phil,
        "Most visitors to Hanoi face a frustrating compromise: either join crowded group tours rushing through souvenir shops with zero memorable photos, or book awkward commercial photoshoots where a photographer directs stiff, fake poses with no cultural context. **TravelFrame was founded to bridge this gap.** We pair you with an articulate, welcoming Hanoi insider who knows the hidden alleys, century-old cafes, and golden-hour light—guiding you naturally while capturing authentic, movie-still moments.",
    )

    add_callout(
        doc,
        "**Core Brand Promise:** Explore Hanoi at your own pace with a trusted local friend. Zero tourist traps, zero stiff posing, and you walk away with a ready-to-share album of timeless memories within 24 to 48 hours.",
    )

    # 3. Why TravelFrame Comparison Table
    add_section_title(doc, "2. Why Discerning Travelers Choose TravelFrame")
    p_comp = doc.add_paragraph()
    add_inline_runs(p_comp, "Here is how a TravelFrame experience directly compares to conventional options:")

    table_comp = doc.add_table(rows=5, cols=3)
    table_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_comp.autofit = False
    set_table_borders(table_comp)

    col_widths = [Inches(1.8), Inches(2.5), Inches(2.6)]
    for row in table_comp.rows:
        for i, width in enumerate(col_widths):
            row.cells[i].width = width

    headers = ["Aspect", "Traditional Tours / Solo Photoshoots", "The TravelFrame Experience"]
    for i, h in enumerate(headers):
        cell = table_comp.rows[0].cells[i]
        set_cell_fill(cell, DARK_TEAL)
        set_cell_margins(cell, top=100, start=120, bottom=100, end=120)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor.from_string(WHITE)

    set_repeat_table_header(table_comp.rows[0])

    data_comp = [
        ("The Host & Vibe", "Rigid commercial guide or silent photographer with a camera", "**A welcoming local friend** who speaks fluent English, shares authentic stories, and gently guides natural posture."),
        ("Pacing & Routes", "Fixed crowded tourist paths; rushed 15-minute stops", "**Private, flexible pace** through handpicked historic streets, hidden courtyards, and quiet cafe terraces."),
        ("Visual Output", "Blurry phone selfies, awkward tripod setups, or over-filtered studio portraits", "**Cinematic editorial photography & vertical 9:16 Reels** shot on professional Sony/Canon full-frame gear."),
        ("Turnaround SLA", "Weeks of waiting or unretouched bulk raw files", "**24-hour sneak peek preview** for your trip stories + 48-72h private online gallery with full digital retouching."),
    ]

    for row_idx, data in enumerate(data_comp, start=1):
        row = table_comp.rows[row_idx]
        set_cant_split(row)
        bg = WARM_GRAY if row_idx % 2 == 1 else WHITE
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            set_cell_fill(cell, bg)
            set_cell_margins(cell, top=80, start=100, bottom=80, end=100)
            p = cell.paragraphs[0]
            add_inline_runs(p, text, base_size=9.8)

    # 4. The 4 Signature Moods
    add_section_title(doc, "3. Four Signature Aesthetic Moods")
    p_mood = doc.add_paragraph()
    add_inline_runs(p_mood, "Guests can tailor their route by choosing one or two visual styles to reflect their personal taste:")

    moods = [
        ("🏛️ Heritage Hanoi (Timeless Depth)", "Explore ancient temple eaves, moss-covered pagodas, the Temple of Literature, and centuries-old French colonial facades. Color profile: warm earthen tones, rich architectural depth, and thoughtful framing."),
        ("☕ Everyday Hanoi (Vibrant Street Rhythm)", "Wander through the Old Quarter's maze of artisan guilds, Dong Xuan Market, quiet cafe balconies, and historic Train Street. Color profile: candid documentary style, steaming coffee, and kinetic city energy."),
        ("✨ Hanoi in Style (Colonial Elegance)", "Designed for timeless couple portraits and solo editorial shots around the French Quarter, Hanoi Opera House, Metropole perimeter, and tree-lined Phan Dinh Phung. Color profile: clean editorial elegance with golden backlighting."),
        ("🌙 Hanoi After Dark (Cinematic Neon)", "Capture Hanoi's enchanting twilight from Long Bien Bridge, bustling night markets, street food stalls, and neon-lit atmospheric alleys. Color profile: high-contrast cinematic tones with lush night ambiance."),
    ]

    for title, desc in moods:
        p_m = doc.add_paragraph()
        p_m.paragraph_format.space_before = Pt(4)
        p_m.paragraph_format.space_after = Pt(2)
        r_m = p_m.add_run(f"• {title}: ")
        r_m.bold = True
        r_m.font.color.rgb = RGBColor.from_string(DARK_TEAL)
        add_inline_runs(p_m, desc, base_size=10.2)

    # 5. Packages & Pricing Table
    add_section_title(doc, "4. All-Inclusive Tour Packages & Transparent Pricing")
    p_price = doc.add_paragraph()
    add_inline_runs(
        p_price,
        "TravelFrame adopts a 100% transparent **All-Inclusive Model (Model A)**. The price quoted is the final price for your private group—including your dedicated host/photographer, entrance tickets, beverage stops, and professional photo retouching. No hidden fees.",
    )

    table_pkg = doc.add_table(rows=4, cols=4)
    table_pkg.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_pkg.autofit = False
    set_table_borders(table_pkg)

    pkg_widths = [Inches(1.8), Inches(1.5), Inches(2.2), Inches(1.4)]
    for row in table_pkg.rows:
        for i, width in enumerate(pkg_widths):
            row.cells[i].width = width

    pkg_headers = ["Package Name", "Duration & Size", "Inclusions & Visual Deliverables", "All-Inclusive Price"]
    for i, h in enumerate(pkg_headers):
        cell = table_pkg.rows[0].cells[i]
        set_cell_fill(cell, BRAND_TEAL)
        set_cell_margins(cell, top=110, start=120, bottom=110, end=120)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor.from_string(WHITE)

    set_repeat_table_header(table_pkg.rows[0])

    pkg_data = [
        (
            "**1. The Quick Photo Walk**\n*(Light Exploration)*",
            "• **2 - 2.5 Hours**\n• 1 - 2 Guests\n• Flexible morning or afternoon departure",
            "• Focused walk through 1 key zone (Old Quarter or French Quarter)\n• **15+ retouched high-res photos**\n• All high-res color-graded originals\n• 1 specialty local drink (Egg coffee or tea)\n• **Turnaround: 24 - 48 hours**",
            "**$75 USD**\n*(~1,950,000 VND)*\n*Private group rate*",
        ),
        (
            "**2. The Signature Story Tour**\n*(⭐ Most Popular)*",
            "• **4 - 4.5 Hours**\n• 1 - 3 Guests\n• Sunrise (7:30 AM) or Golden Hour (2:00 PM)",
            "• Blend of 2 chosen Moods across Old & French Quarters\n• **35+ master retouched photos**\n• **1 edited 9:16 vertical Reel (30-45s)**\n• Entrance fees included\n• Iconic street food tasting & coffee break\n• **Turnaround: 48 hours**",
            "**$160 USD**\n*(~4,150,000 VND)*\n*Private group rate*",
        ),
        (
            "**3. The Full-Day Cultural Odyssey**\n*(Ultimate Deep-Dive)*",
            "• **8 - 9 Hours**\n• 2 - 6 Guests\n• Private full-day vehicle with driver",
            "• Complete Hanoi panorama + Craft Village (Bat Trang Pottery or Incense Village)\n• **60+ magazine-ready retouched photos**\n• **1 cinematic short film (60-90s)**\n• Full raw footage clips for social media\n• Traditional Vietnamese lunch included\n• **Turnaround: 72 hours**",
            "**$290 USD**\n*(~7,500,000 VND)*\n*Private group rate*",
        ),
    ]

    for row_idx, data in enumerate(pkg_data, start=1):
        row = table_pkg.rows[row_idx]
        set_cant_split(row)
        bg = LIGHT_BG if row_idx == 2 else (WARM_GRAY if row_idx % 2 == 1 else WHITE)
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            set_cell_fill(cell, bg)
            set_cell_margins(cell, top=100, start=110, bottom=100, end=110)
            p = cell.paragraphs[0]
            add_inline_runs(p, text, base_size=9.6)

    # 6. SLA & Gear
    add_section_title(doc, "5. Visual Service Level Agreement (SLA) & Equipment Guarantee")
    p_sla = doc.add_paragraph()
    add_inline_runs(
        p_sla,
        "We treat your travel memories with the utmost technical rigor:\n"
        "• **Professional Full-Frame Cameras:** Sony A7 series and Canon R series equipped with high-aperture prime lenses (35mm f/1.4, 50mm f/1.2, 85mm f/1.4) ensuring creamy depth of field and remarkable low-light rendering.\n"
        "• **Audio & Video Quality:** 4K 60fps vertical footage recorded with wireless DJI/Rode microphones for crisp ambient street sound and clear dialogue.\n"
        "• **24-Hour Trip Sneak Peek:** We deliver 3-5 beautifully graded hero shots within 24 hours of tour completion so you can share real-time updates with friends and family.\n"
        "• **Private Cloud Gallery:** Your finished album is hosted on an encrypted private gallery (Google Drive / Pixieset) available for instant high-res and web-optimized download for 6 months.\n"
        "• **Strict Privacy Policy:** Your personal photos belong to you. TravelFrame never publishes client imagery on our social channels without prior written consent.",
    )

    # 7. Real Guest Feedback & Social Proof
    add_section_title(doc, "6. Verified Traveler Impressions")
    testimonials = [
        ("**Emma R. (Solo Traveler, Sydney, Australia):**\n*\"Traveling solo in Southeast Asia can make getting good photos nearly impossible without awkward selfie sticks. Mike from TravelFrame was like walking around Hanoi with an old friend who just happens to be a brilliant photographer. The photos look like stills from an indie film!\"*"),
        ("**David & Chloe (Couple / Honeymoon, London, UK):**\n*\"We hate stiff studio photography. TravelFrame captured genuine laughter, candid glances over egg coffee, and the soul of the French Quarter without ever making us feel posed. The 24-hour preview made our entire trip!\"*"),
        ("**Marcus K. (Content Creator, Berlin, Germany):**\n*\"The 9:16 vertical Reel footage was shot and graded impeccably. TravelFrame took me to hidden balconies and train tracks I would never have found on my own. Worth every single penny.\"*"),
    ]
    for t in testimonials:
        add_callout(doc, t, border_color=DARK_TEAL, bg_color=WARM_GRAY)
        doc.add_paragraph()

    # 8. Booking & Booking Rules
    add_section_title(doc, "7. Simple 3-Step Booking Flow & Flexible Policies")
    p_flow = doc.add_paragraph()
    add_inline_runs(
        p_flow,
        "Booking your private session takes less than 3 minutes:\n"
        "1. **Step 1 — Share Your Date & Vibe:** Select your preferred tour date, group size, and favorite Mood.\n"
        "2. **Step 2 — Tailor the Route:** Connect directly with our team via WhatsApp or Instagram DM to confirm hotel pickup, timing, and personal requests.\n"
        "3. **Step 3 — Meet Your Host & Enjoy:** Receive your formal written confirmation. No stress, no deposit forfeiture.\n\n"
        "**Peace of Mind Policies:**\n"
        "• **Free Cancellation:** Full refund up to 48 hours prior to your scheduled tour departure.\n"
        "• **Weather Guarantee:** In the event of heavy monsoon rain, we will either reschedule free of charge or adjust routes to Hanoi's most atmospheric covered colonnades, art galleries, and historic cafes.",
    )

    # 9. Contact / Direct Pitch CTA
    add_section_title(doc, "8. Connect With TravelFrame Today")
    p_contact = doc.add_paragraph()
    add_inline_runs(
        p_contact,
        "**Ready to turn your Hanoi trip into your personal visual story?**\n"
        "• **Instagram Direct Message:** `@travelframe.vn`\n"
        "• **WhatsApp Concierge:** `+84 (0) 904 888 644` (Fast 15-minute response time)\n"
        "• **Official Website:** `https://travelframe.sidevn.com`\n"
        "• **Email Inquiries:** `hello@travelframe.vn`\n\n"
        "*Private tours are limited to 2 sessions per host per day to preserve exclusivity and bespoke attention. Advance reservation is strongly recommended.*",
    )

    doc.save(str(OUTPUT))
    print(f"Successfully generated Pitching Catalogue DOCX at: {OUTPUT}")


if __name__ == "__main__":
    main()
