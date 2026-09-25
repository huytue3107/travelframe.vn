#!/usr/bin/env python3
"""
Generate Microsoft Word (.docx) documents for TravelFrame's content suite.
Embeds curated high-resolution photos and AI visuals for each article (>= 3 images per article).
Adheres strictly to Humanizer writing rules (no em-dashes, clean professional tone).
Saves both to local deliverables and to Google Drive (travelframe.vn).
"""

import os
import re
import shutil
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

# Typography & Color Palette
COLOR_PRIMARY = RGBColor(26, 43, 76)      # Deep Navy
COLOR_SECONDARY = RGBColor(45, 85, 125)   # Muted Blue
COLOR_TEXT = RGBColor(34, 34, 34)         # Off-black
COLOR_MUTED = RGBColor(110, 110, 110)     # Gray for captions / meta
COLOR_WHITE = RGBColor(255, 255, 255)
HEX_HEADER_BG = "1A2B4C"
HEX_ALT_ROW = "F4F6F9"

WORKSPACE_ROOT = Path("/Users/macbook/Codex GPT/travelframe.vn")
LOCAL_OUTPUT_DIR = WORKSPACE_ROOT / "Creative-Production" / "Deliverables" / "Docx"
GDRIVE_DIR = Path("/Users/macbook/Library/CloudStorage/GoogleDrive-huytue3107@gmail.com/My Drive/travelframe.vn")
STOCK_DIR = WORKSPACE_ROOT / "Creative-Production" / "Assets" / "Stock"
AI_DIR = WORKSPACE_ROOT / "Creative-Production" / "Assets" / "AI-Generated"

def set_cell_background(cell, fill_hex):
    """Set background color of a table cell."""
    tc_pr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tc_pr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Set inner padding for table cell."""
    tc_pr = cell._element.get_or_add_tcPr()
    tc_mar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tc_mar.append(node)
    tc_pr.append(tc_mar)

def sanitize_text(text: str) -> str:
    """Apply Humanizer constraints: remove em-dashes and clean formatting."""
    # Replace em-dashes with colon, hyphen, or comma
    text = text.replace(" — ", ": ").replace("—", " - ")
    # Clean up double spaces
    text = re.sub(r" +", " ", text)
    return text.strip()

def add_styled_heading(doc, text: str, level: int):
    """Add a styled heading with controlled font, color and spacing."""
    text = sanitize_text(text)
    heading = doc.add_heading(level=level)
    run = heading.add_run(text)
    run.font.name = "Arial"
    
    p_format = heading.paragraph_format
    if level == 1:
        run.font.size = Pt(15)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        p_format.space_before = Pt(14)
        p_format.space_after = Pt(4)
        p_format.keep_with_next = True
    elif level == 2:
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_SECONDARY
        p_format.space_before = Pt(10)
        p_format.space_after = Pt(3)
        p_format.keep_with_next = True
    elif level == 3:
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        p_format.space_before = Pt(8)
        p_format.space_after = Pt(2)
        p_format.keep_with_next = True
    return heading

def add_styled_paragraph(doc, text: str, bold_prefix: str = None, italic: bool = False):
    """Add a styled body paragraph with Arial 10.5pt, 1.15 line spacing."""
    p = doc.add_paragraph()
    p_format = p.paragraph_format
    p_format.line_spacing = 1.15
    p_format.space_after = Pt(5)
    
    if bold_prefix:
        r_pre = p.add_run(sanitize_text(bold_prefix) + " ")
        r_pre.font.name = "Arial"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_PRIMARY
    
    r_body = p.add_run(sanitize_text(text))
    r_body.font.name = "Arial"
    r_body.font.size = Pt(10.5)
    r_body.font.italic = italic
    r_body.font.color.rgb = COLOR_TEXT
    return p

def add_styled_bullet(doc, text: str, bold_prefix: str = None):
    """Add a bullet point."""
    p = doc.add_paragraph(style='List Bullet')
    p_format = p.paragraph_format
    p_format.line_spacing = 1.15
    p_format.space_after = Pt(3)
    
    if bold_prefix:
        r_pre = p.add_run(sanitize_text(bold_prefix) + " ")
        r_pre.font.name = "Arial"
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_PRIMARY
        
    r_body = p.add_run(sanitize_text(text))
    r_body.font.name = "Arial"
    r_body.font.size = Pt(10)
    r_body.font.color.rgb = COLOR_TEXT
    return p

def add_image_with_caption(doc, image_path: Path, caption: str, credit: str):
    """Embed an image with 5.6 inches width, centered, followed by caption."""
    if not image_path.is_file():
        print(f"Warning: Image file not found: {image_path}")
        return
        
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(2)
    
    run_img = p_img.add_run()
    run_img.add_picture(str(image_path), width=Inches(5.6))
    
    # Caption
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(0)
    p_cap.paragraph_format.space_after = Pt(10)
    
    cap_text = sanitize_text(caption)
    if credit:
        cap_text += f" | {credit}"
        
    r_cap = p_cap.add_run(f"Figure: {cap_text}")
    r_cap.font.name = "Arial"
    r_cap.font.size = Pt(8.5)
    r_cap.font.italic = True
    r_cap.font.color.rgb = COLOR_MUTED

def add_styled_table(doc, headers: list[str], rows: list[list[str]], col_widths: list[float] = None):
    """Add a professionally styled table with header formatting and alternating rows."""
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Format header
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = sanitize_text(title)
        set_cell_background(hdr_cells[i], HEX_HEADER_BG)
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=150, right=150)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.name = "Arial"
            run.font.size = Pt(9.5)
            run.font.bold = True
            run.font.color.rgb = COLOR_WHITE
            
    # Format data rows
    for r_idx, row_data in enumerate(rows):
        row_cells = table.rows[r_idx + 1].cells
        bg_color = HEX_ALT_ROW if (r_idx % 2 == 1) else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = sanitize_text(val)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=100, bottom=100, left=150, right=150)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Arial"
                run.font.size = Pt(9)
                run.font.color.rgb = COLOR_TEXT
                
    # Column widths if specified
    if col_widths:
        for row in table.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)
                
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def set_document_page_setup(doc):
    """Configure standard page setup: Letter size with 1-inch margins."""
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header / footer for subsequent pages
        footer = section.footer
        p_footer = footer.paragraphs[0]
        p_footer.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_f = p_footer.add_run("TravelFrame.vn · Content Marketing Suite 2026")
        r_f.font.name = "Arial"
        r_f.font.size = Pt(8)
        r_f.font.color.rgb = COLOR_MUTED

def parse_and_build_article(doc, md_path: Path, image_specs: list[dict], is_standalone: bool = True):
    """
    Parse markdown file and populate docx document with headings, paragraphs,
    bullets, tables, and inserted images at designated spots.
    """
    content = md_path.read_text(encoding="utf-8")
    lines = content.splitlines()
    
    in_table = False
    table_headers = []
    table_rows = []
    
    # Create fresh copy of image specs so state is tracked cleanly
    specs = [dict(s) for s in image_specs]
    for s in specs:
        s["inserted"] = False
    
    for i, line in enumerate(lines):
        line_str = line.strip()
        
        # Handle markdown table
        if line_str.startswith("|") and line_str.endswith("|"):
            parts = [p.strip() for p in line_str[1:-1].split("|")]
            # Check if this is divider row
            if all(re.match(r"^:?-+:?$", p) for p in parts):
                continue
            if not in_table:
                in_table = True
                table_headers = parts
                table_rows = []
            else:
                table_rows.append(parts)
            continue
        else:
            if in_table:
                add_styled_table(doc, table_headers, table_rows)
                in_table = False
                table_headers = []
                table_rows = []
                
        if not line_str:
            continue
            
        # Ignore markdown horizontal breaks
        if line_str in ("---", "***", "___"):
            continue
            
        # Title (H1)
        if line_str.startswith("# "):
            title_text = line_str[2:].strip()
            p_title = doc.add_paragraph()
            p_title.paragraph_format.space_before = Pt(14 if is_standalone else 20)
            p_title.paragraph_format.space_after = Pt(4)
            r_t = p_title.add_run(sanitize_text(title_text))
            r_t.font.name = "Arial"
            r_t.font.size = Pt(18)
            r_t.font.bold = True
            r_t.font.color.rgb = COLOR_PRIMARY
            continue
            
        # Byline / Metadata
        if line_str.startswith("*By ") or line_str.startswith("*"):
            byline = line_str.strip("*")
            p_by = doc.add_paragraph()
            p_by.paragraph_format.space_after = Pt(10)
            r_by = p_by.add_run(sanitize_text(byline))
            r_by.font.name = "Arial"
            r_by.font.size = Pt(9.5)
            r_by.font.italic = True
            r_by.font.color.rgb = COLOR_MUTED
            continue
            
        # Headings
        if line_str.startswith("## "):
            h_text = line_str[3:].strip()
            add_styled_heading(doc, h_text, level=1)
            
            # Check if an image should be placed after this heading
            for spec in specs:
                if spec.get("after_heading") and spec["after_heading"].lower() in h_text.lower() and not spec.get("inserted"):
                    add_image_with_caption(doc, spec["path"], spec["caption"], spec["credit"])
                    spec["inserted"] = True
            continue
            
        if line_str.startswith("### "):
            h_text = line_str[4:].strip()
            add_styled_heading(doc, h_text, level=2)
            
            # Check if an image should be placed after this sub-heading
            for spec in specs:
                if spec.get("after_subheading") and spec["after_subheading"].lower() in h_text.lower() and not spec.get("inserted"):
                    add_image_with_caption(doc, spec["path"], spec["caption"], spec["credit"])
                    spec["inserted"] = True
            continue
            
        # Bullet list
        if line_str.startswith("- ") or line_str.startswith("* "):
            raw_item = line_str[2:].strip()
            match_bold = re.match(r"^\*\*([^*]+)\*\*(.*)$", raw_item)
            if match_bold:
                prefix = match_bold.group(1).strip()
                body = match_bold.group(2).strip()
                # If prefix ends with colon, clean it
                if prefix.endswith(":"):
                    prefix = prefix[:-1]
                add_styled_bullet(doc, body, bold_prefix=prefix)
            else:
                add_styled_bullet(doc, raw_item)
            continue
            
        # Numbered list item
        match_num = re.match(r"^(\d+)\.\s+(.*)$", line_str)
        if match_num:
            num = match_num.group(1)
            raw_item = match_num.group(2)
            match_bold = re.match(r"^\*\*([^*]+)\*\*(.*)$", raw_item)
            if match_bold:
                prefix = f"{num}. {match_bold.group(1).strip()}"
                body = match_bold.group(2).strip()
                add_styled_paragraph(doc, body, bold_prefix=prefix)
            else:
                add_styled_paragraph(doc, raw_item, bold_prefix=f"{num}.")
            continue
            
        # Regular paragraph
        match_bold = re.match(r"^\*\*([^*]+)\*\*(.*)$", line_str)
        if match_bold:
            prefix = match_bold.group(1).strip()
            body = match_bold.group(2).strip()
            add_styled_paragraph(doc, body, bold_prefix=prefix)
        else:
            add_styled_paragraph(doc, line_str)
            
    if in_table:
        add_styled_table(doc, table_headers, table_rows)
        
    # Append any uninserted images
    for spec in specs:
        if not spec.get("inserted"):
            add_image_with_caption(doc, spec["path"], spec["caption"], spec["credit"])
            spec["inserted"] = True

def main():
    print("Starting TravelFrame Docx Suite Generation...")
    
    LOCAL_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    GDRIVE_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Article Specifications
    articles = [
        {
            "id": "01-Hanoi-Travel-Guide-2026",
            "title": "The Complete Hanoi Travel Guide 2026",
            "md_file": WORKSPACE_ROOT / "Marketing-Growth" / "Content" / "Drafts" / "Blog-Hanoi-Travel-Guide-2026.md",
            "images": [
                {
                    "path": STOCK_DIR / "pexels-32014789-warren-yip.jpg",
                    "after_heading": "Where to Stay: Neighborhood Guide",
                    "caption": "Morning sunlight illuminating the traditional street life and cyclos of the Hanoi Old Quarter.",
                    "credit": "Photo: Warren Yip / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-32381205-nguyen-ngoc-tien.jpg",
                    "after_subheading": "Sunrise Stroll Around Hoan Kiem Lake",
                    "caption": "Turtle Tower standing serenely amidst morning mist on Hoan Kiem Lake.",
                    "credit": "Photo: Nguyen Ngoc Tien / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-28448335-h-a-l-nh.jpg",
                    "after_subheading": "Experiencing Hanoi Train Street",
                    "caption": "Local train passing through the residential corridor of Hanoi Train Street.",
                    "credit": "Photo: Hòa Lê Đình / Pexels"
                }
            ]
        },
        {
            "id": "02-Best-Photo-Spots-Hanoi",
            "title": "15 Best Photo Spots in Hanoi: Field Guide",
            "md_file": WORKSPACE_ROOT / "Marketing-Growth" / "Content" / "Drafts" / "Blog-Best-Photo-Spots-Hanoi.md",
            "images": [
                {
                    "path": STOCK_DIR / "pexels-30405563-felix-young.jpg",
                    "after_subheading": "Long Bien Bridge",
                    "caption": "Woman in red Ao Dai standing on the historic century-old steel cantilever spans of Long Bien Bridge.",
                    "credit": "Photo: Felix Young / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-31833270-nguyen-duc-toan.jpg",
                    "after_subheading": "St. Joseph’s Cathedral",
                    "caption": "Gothic architecture and weathered stone facade of St. Joseph's Cathedral framed by green trees.",
                    "credit": "Photo: Nguyen Duc Toan / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-2853964-loifotos.jpg",
                    "after_subheading": "Temple of Literature",
                    "caption": "Classic Vietnamese pagoda pavilion surrounded by water and greenery, showcasing traditional architectural symmetry.",
                    "credit": "Photo: Loifotos / Pexels"
                }
            ]
        },
        {
            "id": "03-Hanoi-Street-Food-Guide",
            "title": "The Honest Hanoi Street Food Guide 2026",
            "md_file": WORKSPACE_ROOT / "Marketing-Growth" / "Content" / "Drafts" / "Blog-Hanoi-Street-Food-Guide.md",
            "images": [
                {
                    "path": STOCK_DIR / "pexels-4153908-nam-phong-b-i.jpg",
                    "after_subheading": "Traditional Hanoi Beef Pho",
                    "caption": "Steaming bowl of authentic Hanoi beef pho with scallions, fresh herbs, and rich bone broth.",
                    "credit": "Photo: Nam Phong Bùi / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-3858270-markus-winkler.jpg",
                    "after_subheading": "Charcoal-Grilled Pork with Rice Noodles",
                    "caption": "Hanoi Bun Cha served with charcoal grilled pork patties, fresh rice vermicelli, and aromatic herbs.",
                    "credit": "Photo: Markus Winkler / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-35409563-jordan-coleman.jpg",
                    "after_subheading": "The Crispy Hanoi Baguette",
                    "caption": "Crisp Vietnamese Banh Mi sandwich freshly assembled with rich pate and crisp cucumbers.",
                    "credit": "Photo: Jordan Coleman / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-36433563-s-c-n-ng-ng.jpg",
                    "after_subheading": "Authentic Hanoi Egg Coffee",
                    "caption": "Traditional Vietnamese iced coffee on a sidewalk table, a daily staple of Hanoi street life.",
                    "credit": "Photo: Sóc Năng Động / Pexels"
                },
                {
                    "path": AI_DIR / "nano-banana-hanoi-coffee-diorama.jpg",
                    "after_heading": "Street Food Etiquette",
                    "caption": "Visual concept: 3D miniature diorama of a classic Hanoi sidewalk cafe.",
                    "credit": "AI Concept by Nano Banana for TravelFrame"
                }
            ]
        },
        {
            "id": "04-Hiring-Private-Photographer-In-Hanoi",
            "title": "Hiring a Private Photographer in Hanoi: 2026 Guide",
            "md_file": WORKSPACE_ROOT / "Marketing-Growth" / "Content" / "Drafts" / "Article-Hiring-Private-Photographer-In-Hanoi.md",
            "images": [
                {
                    "path": STOCK_DIR / "pexels-36418084-tuan-vy.jpg",
                    "after_heading": "How private photo walks work",
                    "caption": "Personal photographer capturing candid travel moments in the bustling streets of Hanoi.",
                    "credit": "Photo: Tuan Vy / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-20039296-to-n-v-n.jpg",
                    "after_subheading": "The Old Quarter",
                    "caption": "Couple photoshoot in traditional Vietnamese dress on historic Hanoi streets.",
                    "credit": "Photo: Toàn Văn / Pexels"
                },
                {
                    "path": STOCK_DIR / "pexels-38722652-quang-vinh.jpg",
                    "after_subheading": "Temple of Literature",
                    "caption": "Solo travel portrait capturing serene expressions in an ancient temple courtyard.",
                    "credit": "Photo: quang vinh / Pexels"
                }
            ]
        }
    ]
    
    generated_files = []
    
    # 2. Build 4 Individual Documents
    for art in articles:
        print(f"\nBuilding individual docx: {art['id']}.docx...")
        doc = docx.Document()
        set_document_page_setup(doc)
        
        parse_and_build_article(doc, art["md_file"], art["images"], is_standalone=True)
        
        local_path = LOCAL_OUTPUT_DIR / f"{art['id']}.docx"
        doc.save(str(local_path))
        print(f"  -> Saved local: {local_path} ({local_path.stat().st_size:,} bytes)")
        
        # Copy to Google Drive
        gdrive_path = GDRIVE_DIR / f"{art['id']}.docx"
        shutil.copy2(local_path, gdrive_path)
        print(f"  -> Copied to Google Drive: {gdrive_path}")
        generated_files.append((art['title'], local_path, gdrive_path, len(art['images'])))
        
    # 3. Build Consolidated Master Document
    print("\nBuilding Consolidated Master Document: TravelFrame-Tong-Hop-Bai-Viet-Kem-Anh-2026.docx...")
    master_doc = docx.Document()
    set_document_page_setup(master_doc)
    
    # Title Page
    p_cover_pre = master_doc.add_paragraph()
    p_cover_pre.paragraph_format.space_before = Pt(80)
    
    p_main_title = master_doc.add_paragraph()
    r_mt = p_main_title.add_run("TravelFrame.vn · Bộ Ấn Phẩm Nội Dung & Visuals 2026")
    r_mt.font.name = "Arial"
    r_mt.font.size = Pt(24)
    r_mt.font.bold = True
    r_mt.font.color.rgb = COLOR_PRIMARY
    p_main_title.paragraph_format.space_after = Pt(8)
    
    p_sub = master_doc.add_paragraph()
    r_sub = p_sub.add_run("Tuyển tập 4 bài viết trụ cột SEO & Chuyển đổi kèm bộ hình ảnh minh họa chất lượng cao")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = COLOR_SECONDARY
    p_sub.paragraph_format.space_after = Pt(20)
    
    p_meta = master_doc.add_paragraph()
    meta_text = (
        "Đơn vị phát hành: TravelFrame Vietnam (travelframe.vn)\n"
        "Ngày hoàn thiện: 15/09/2026\n"
        "Quy chuẩn nội dung: Humanizer Engine (Giọng văn chân thật, gãy gọn, loại bỏ khuôn mẫu AI)\n"
        "Hệ thống hình ảnh: Curated Stock qua Pexels API & Nano Banana 3D Visual Pipeline\n"
        "Tổng số hình ảnh tích hợp: 14 ảnh có bản quyền & credit chi tiết"
    )
    r_meta = p_meta.add_run(meta_text)
    r_meta.font.name = "Arial"
    r_meta.font.size = Pt(10)
    r_meta.font.color.rgb = COLOR_MUTED
    p_meta.paragraph_format.space_after = Pt(30)
    
    # Table of Contents
    add_styled_heading(master_doc, "Mục Lục Các Bài Viết Trong Tập Tài Liệu", level=1)
    toc_data = [
        ["Phần 1", "The Complete Hanoi Travel Guide 2026", "3 ảnh minh họa (Phố cổ, Hồ Gươm, Train Street)"],
        ["Phần 2", "15 Best Photo Spots in Hanoi (Field Guide)", "3 ảnh minh họa (Cầu Long Biên, Nhà Thờ Lớn, Chùa Trấn Quốc)"],
        ["Phần 3", "The Honest Hanoi Street Food Guide 2026", "5 ảnh minh họa (Phở bò, Bún chả, Bánh mì, Cà phê, 3D Diorama)"],
        ["Phần 4", "Hiring a Private Photographer in Hanoi", "3 ảnh minh họa (Nhiếp ảnh gia đường phố, Chụp đôi, Chụp chùa cổ)"]
    ]
    add_styled_table(master_doc, ["Số thứ tự", "Tên bài viết", "Bộ hình ảnh tích hợp"], toc_data, col_widths=[1.0, 3.2, 2.3])
    
    master_doc.add_page_break()
    
    # Append each article
    for idx, art in enumerate(articles):
        p_div = master_doc.add_paragraph()
        r_div = p_div.add_run(f"PHẦN {idx + 1}: {art['title'].upper()}")
        r_div.font.name = "Arial"
        r_div.font.size = Pt(11)
        r_div.font.bold = True
        r_div.font.color.rgb = COLOR_MUTED
        p_div.paragraph_format.space_before = Pt(10)
        p_div.paragraph_format.space_after = Pt(2)
        
        parse_and_build_article(master_doc, art["md_file"], art["images"], is_standalone=False)
        
        if idx < len(articles) - 1:
            master_doc.add_page_break()
            
    master_local_path = LOCAL_OUTPUT_DIR / "TravelFrame-Tong-Hop-Bai-Viet-Kem-Anh-2026.docx"
    master_doc.save(str(master_local_path))
    print(f"  -> Saved local master: {master_local_path} ({master_local_path.stat().st_size:,} bytes)")
    
    master_gdrive_path = GDRIVE_DIR / "TravelFrame-Tong-Hop-Bai-Viet-Kem-Anh-2026.docx"
    shutil.copy2(master_local_path, master_gdrive_path)
    print(f"  -> Copied master to Google Drive: {master_gdrive_path}")
    
    # Also export keyword research strategy
    kw_md = WORKSPACE_ROOT / "Marketing-Growth" / "Content" / "Drafts" / "Keyword-Research-TravelFrame-2026.md"
    if kw_md.is_file():
        print("\nBuilding Keyword Strategy Doc: 00-Keyword-Research-Strategy-2026.docx...")
        doc_kw = docx.Document()
        set_document_page_setup(doc_kw)
        parse_and_build_article(doc_kw, kw_md, [], is_standalone=True)
        kw_local = LOCAL_OUTPUT_DIR / "00-Keyword-Research-Strategy-2026.docx"
        doc_kw.save(str(kw_local))
        shutil.copy2(kw_local, GDRIVE_DIR / "00-Keyword-Research-Strategy-2026.docx")
        print(f"  -> Saved and synced Strategy docx: {kw_local.name}")
    
    print("\nAll documents generated and synced to Google Drive successfully!")

if __name__ == "__main__":
    main()
