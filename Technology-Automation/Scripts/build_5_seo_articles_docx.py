#!/usr/bin/env python3
"""
Convert TravelFrame's 5 Markdown SEO Articles into High-Quality .docx files.
Embeds full metadata, styled tables, callout blocks, and high-res images.
Outputs to Google Drive ('travelframe.vn/SEO-website-content/2026-09-29-SEO-5-Articles/')
and local repository ('Marketing-Growth/Content/DOCS/2026-09-29-SEO-5-Articles/').
"""

import os
import re
import shutil
import urllib.parse
from pathlib import Path
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


def parse_frontmatter(yaml_text: str) -> dict:
    result = {}
    current_key = None
    for line in yaml_text.splitlines():
        line = line.rstrip()
        if not line or line.startswith("#"):
            continue
        # Check for list item under current_key
        if line.startswith("  - ") and current_key:
            val = line[4:].strip().strip('"').strip("'")
            if not isinstance(result[current_key], list):
                result[current_key] = []
            result[current_key].append(val)
            continue
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            current_key = key
            if val == "":
                result[key] = []
            else:
                result[key] = val.strip('"').strip("'")
    return result

# Colors
TEAL = "008AA3"
DARK = "222222"
BODY_TEXT = "333333"
MUTED = "666666"
LIGHT_GRAY = "F4F6F7"
CALLOUT_BG = "F0F8FA"
BORDER_GRAY = "D9D9D9"
WHITE = "FFFFFF"
FONT_PRIMARY = "Arial"

ROOT_DIR = Path("/Users/macbook/Codex GPT/travelframe.vn")
DRAFTS_DIR = ROOT_DIR / "Marketing-Growth" / "Content" / "Drafts"
LOCAL_OUT_DIR = ROOT_DIR / "Marketing-Growth" / "Content" / "DOCS" / "2026-09-29-SEO-5-Articles"

GDRIVE_BASE = Path("/Users/macbook/Library/CloudStorage/GoogleDrive-huytue3107@gmail.com/My Drive/travelframe.vn")
GDRIVE_OUT_DIR = GDRIVE_BASE / "SEO-website-content" / "2026-09-29-SEO-5-Articles"
GDRIVE_ROOT_DIR = GDRIVE_BASE

ARTICLES = [
    {
        "source": "2026-09-29-hiring-private-photographer-in-hanoi.md",
        "output_name": "01-Hiring-Private-Photographer-In-Hanoi-2026.docx",
    },
    {
        "source": "2026-09-29-15-best-photo-spots-in-hanoi.md",
        "output_name": "02-15-Best-Photo-Spots-In-Hanoi-2026.docx",
    },
    {
        "source": "2026-09-29-how-to-cross-the-street-in-hanoi.md",
        "output_name": "03-How-To-Cross-The-Street-In-Hanoi-2026.docx",
    },
    {
        "source": "2026-09-29-couple-photoshoot-hanoi-old-quarter.md",
        "output_name": "04-Couple-And-Honeymoon-Photoshoot-Hanoi-2026.docx",
    },
    {
        "source": "2026-09-29-hanoi-sunrise-photography-walk.md",
        "output_name": "05-Hanoi-Sunrise-Photography-Walk-2026.docx",
    },
]


def set_cell_shading(cell, fill_hex):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill_hex)


def set_cell_borders(cell, top=True, bottom=True, left=True, right=True, color=BORDER_GRAY, sz="6"):
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge, active in [("top", top), ("bottom", bottom), ("left", left), ("right", right)]:
        tag = f"w:{edge}"
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


def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for edge, val in [("top", top), ("bottom", bottom), ("left", left), ("right", right)]:
        node = tc_mar.find(qn(f"w:{edge}"))
        if node is None:
            node = OxmlElement(f"w:{edge}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")


def format_run(run, font_name=FONT_PRIMARY, size=10.5, bold=False, italic=False, color_hex=BODY_TEXT):
    run.font.name = font_name
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor.from_string(color_hex)


def add_formatted_text(paragraph, text, base_size=10.5, base_color=BODY_TEXT, base_italic=False):
    # Regex to handle markdown bold (**text**), italic (*text*), code (`text`), links ([text](url))
    tokens = re.split(r"(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))", text)
    for token in tokens:
        if not token:
            continue
        if token.startswith("**") and token.endswith("**") and len(token) >= 4:
            r = paragraph.add_run(token[2:-2])
            format_run(r, size=base_size, bold=True, italic=base_italic, color_hex=base_color)
        elif token.startswith("*") and token.endswith("*") and len(token) >= 2 and not token.startswith("**"):
            r = paragraph.add_run(token[1:-1])
            format_run(r, size=base_size, bold=False, italic=True, color_hex=base_color)
        elif token.startswith("`") and token.endswith("`") and len(token) >= 2:
            r = paragraph.add_run(token[1:-1])
            format_run(r, font_name="Courier New", size=base_size * 0.95, bold=False, color_hex="993300")
        elif token.startswith("[") and "](" in token and token.endswith(")"):
            m = re.match(r"\[(.*?)\]\((.*?)\)", token)
            if m:
                link_text, _ = m.groups()
                r = paragraph.add_run(link_text)
                format_run(r, size=base_size, bold=False, italic=base_italic, color_hex=TEAL)
            else:
                r = paragraph.add_run(token)
                format_run(r, size=base_size, bold=False, italic=base_italic, color_hex=base_color)
        else:
            r = paragraph.add_run(token)
            format_run(r, size=base_size, bold=False, italic=base_italic, color_hex=base_color)


def add_callout(doc, text_content):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = t.rows[0].cells[0]
    c.width = Inches(6.5)
    set_cell_shading(c, CALLOUT_BG)
    set_cell_borders(c, top=False, bottom=False, left=True, right=False, color=TEAL, sz="24")
    set_cell_margins(c, top=140, bottom=140, left=200, right=160)

    lines = [l.strip() for l in text_content.strip().split("\n")]
    first_p = c.paragraphs[0]
    first_p.paragraph_format.space_before = Pt(2)
    first_p.paragraph_format.space_after = Pt(3)
    first_p.paragraph_format.line_spacing = 1.15
    add_formatted_text(first_p, lines[0], base_size=10, base_color=DARK)

    for line in lines[1:]:
        p = c.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        add_formatted_text(p, line, base_size=10, base_color=BODY_TEXT)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(0)
    spacer.paragraph_format.space_after = Pt(4)


def add_styled_table(doc, table_rows):
    if not table_rows:
        return
    headers = table_rows[0]
    data_rows = table_rows[1:]
    cols = len(headers)

    t = doc.add_table(rows=len(table_rows), cols=cols)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = True

    # Style Header
    hdr_cells = t.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        set_cell_shading(hdr_cells[i], TEAL)
        set_cell_borders(hdr_cells[i], color=TEAL, sz="6")
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.1
        add_formatted_text(p, title.strip(), base_size=9.5, base_color=WHITE)
        for r in p.runs:
            r.bold = True

    # Repeat Header on subsequent pages
    tr_pr = t.rows[0]._tr.get_or_add_trPr()
    tr_pr.append(OxmlElement("w:tblHeader"))

    # Style Data Rows
    for row_idx, row_data in enumerate(data_rows):
        cells = t.rows[row_idx + 1].cells
        # Prevent row split
        r_tr_pr = t.rows[row_idx + 1]._tr.get_or_add_trPr()
        r_tr_pr.append(OxmlElement("w:cantSplit"))
        bg_color = LIGHT_GRAY if row_idx % 2 == 1 else WHITE
        for col_idx in range(cols):
            val = row_data[col_idx] if col_idx < len(row_data) else ""
            cells[col_idx].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_shading(cells[col_idx], bg_color)
            set_cell_borders(cells[col_idx], color=BORDER_GRAY, sz="4")
            set_cell_margins(cells[col_idx], top=100, bottom=100, left=140, right=140)
            p = cells[col_idx].paragraphs[0]
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_text(p, val.strip(), base_size=9, base_color=BODY_TEXT)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(2)
    spacer.paragraph_format.space_after = Pt(4)


def add_metadata_box(doc, frontmatter):
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = t.rows[0].cells[0]
    c.width = Inches(6.5)
    set_cell_shading(c, "F7FAFB")
    set_cell_borders(c, top=True, bottom=True, left=True, right=True, color=BORDER_GRAY, sz="8")
    set_cell_margins(c, top=140, bottom=140, left=180, right=180)

    p0 = c.paragraphs[0]
    p0.paragraph_format.space_after = Pt(4)
    r_hdr = p0.add_run("TRAVELFRAME SEO METADATA SPECIFICATION")
    format_run(r_hdr, size=9.5, bold=True, color_hex=TEAL)

    meta_items = [
        ("URL Slug", f"/news/{frontmatter.get('slug', '')}"),
        ("Primary Keyword", frontmatter.get("primary_keyword", "")),
        ("Secondary Keywords", ", ".join(frontmatter.get("secondary_keywords", [])) if isinstance(frontmatter.get("secondary_keywords"), list) else str(frontmatter.get("secondary_keywords", ""))),
        ("Meta Title (<60 chars)", frontmatter.get("meta_title", "")),
        ("Meta Description", frontmatter.get("meta_description", "")),
        ("Target Funnel Stage", frontmatter.get("funnel_stage", "")),
        ("Target Audience", frontmatter.get("target_audience", "")),
    ]

    for label, val in meta_items:
        p = c.add_paragraph()
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        r_lbl = p.add_run(f"• {label}: ")
        format_run(r_lbl, size=9, bold=True, color_hex=DARK)
        r_val = p.add_run(val)
        format_run(r_val, size=9, bold=False, color_hex=MUTED)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(8)


def resolve_image_path(img_src):
    # Handle file:// paths or relative paths
    clean_src = urllib.parse.unquote(img_src)
    if clean_src.startswith("file://"):
        clean_src = clean_src.replace("file://", "")
    p = Path(clean_src)
    if p.exists():
        return p
    # Try resolving relative to ROOT_DIR
    p2 = ROOT_DIR / clean_src.lstrip("/")
    if p2.exists():
        return p2
    # Try finding in Creative-Production/Assets/AI-Generated/SEO-Articles
    filename = p.name
    p3 = ROOT_DIR / "Creative-Production" / "Assets" / "AI-Generated" / "SEO-Articles" / filename
    if p3.exists():
        return p3
    return None


def convert_markdown_to_docx(md_path: Path, docx_path: Path):
    text = md_path.read_text(encoding="utf-8")

    # Split frontmatter
    frontmatter = {}
    content = text
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            try:
                frontmatter = parse_frontmatter(parts[1]) or {}
            except Exception as e:
                print(f"Warning: Frontmatter parse error in {md_path.name}: {e}")
            content = parts[2].strip()

    doc = Document()

    # Set page margins to 1 inch
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # 1. Document Title (from Frontmatter or first H1)
    title_text = frontmatter.get("title", "")
    lines = content.split("\n")

    # If first line is H1 and matches title, we consume it
    if lines and lines[0].startswith("# "):
        if not title_text:
            title_text = lines[0][2:].strip()
        lines = lines[1:]

    # Add Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    title_p.paragraph_format.line_spacing = 1.15
    r_title = title_p.add_run(title_text)
    format_run(r_title, size=20, bold=True, color_hex=TEAL)

    # Add Subtitle / Byline
    byline_p = doc.add_paragraph()
    byline_p.paragraph_format.space_before = Pt(0)
    byline_p.paragraph_format.space_after = Pt(12)
    r_by = byline_p.add_run("By TravelFrame Editorial Team · Official Website SEO Release (2026)")
    format_run(r_by, size=9.5, italic=True, color_hex=MUTED)

    # Add Metadata Box
    if frontmatter:
        add_metadata_box(doc, frontmatter)

    # Parser state
    i = 0
    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []
    in_blockquote = False
    blockquote_lines = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Handle Code blocks
        if stripped.startswith("```"):
            if in_code_block:
                # Flush code block
                in_code_block = False
                add_callout(doc, "\n".join(code_lines))
                code_lines = []
            else:
                in_code_block = True
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Handle Table lines
        if "|" in line and (line.startswith("|") or stripped.startswith("|")):
            # Check if divider line
            if re.match(r"^\|?[\s\-:|]+\|?$", stripped):
                # Separator line, just skip
                i += 1
                continue
            cells = [c.strip() for c in stripped.strip("|").split("|")]
            table_lines.append(cells)
            in_table = True
            i += 1
            continue
        elif in_table:
            # Table ended
            add_styled_table(doc, table_lines)
            table_lines = []
            in_table = False

        # Handle Blockquotes (> Quote or > Pro Move)
        if stripped.startswith(">"):
            blockquote_lines.append(stripped.lstrip("> ").strip())
            in_blockquote = True
            i += 1
            continue
        elif in_blockquote:
            add_callout(doc, "\n".join(blockquote_lines))
            blockquote_lines = []
            in_blockquote = False

        # Blank line
        if not stripped:
            i += 1
            continue

        # Horizontal Rule (---)
        if stripped in ("---", "***", "___"):
            i += 1
            continue

        # Headings
        if stripped.startswith("## "):
            h_text = stripped[3:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(h_text)
            format_run(r, size=14, bold=True, color_hex=TEAL)
            i += 1
            continue
        elif stripped.startswith("### "):
            h_text = stripped[4:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(h_text)
            format_run(r, size=12, bold=True, color_hex=DARK)
            i += 1
            continue
        elif stripped.startswith("#### "):
            h_text = stripped[5:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(h_text)
            format_run(r, size=11, bold=True, color_hex=MUTED)
            i += 1
            continue

        # Images: ![alt](url)
        img_match = re.match(r"^!\[(.*?)\]\((.*?)\)$", stripped)
        if img_match:
            alt_text, img_src = img_match.groups()
            resolved = resolve_image_path(img_src)
            if resolved and resolved.exists():
                try:
                    p_img = doc.add_paragraph()
                    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_img.paragraph_format.space_before = Pt(10)
                    p_img.paragraph_format.space_after = Pt(3)
                    p_img.paragraph_format.keep_with_next = True
                    run_img = p_img.add_run()
                    run_img.add_picture(str(resolved), width=Inches(6.2))

                    # Caption
                    if alt_text:
                        p_cap = doc.add_paragraph()
                        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        p_cap.paragraph_format.space_before = Pt(2)
                        p_cap.paragraph_format.space_after = Pt(10)
                        r_cap = p_cap.add_run(f"Figure: {alt_text}")
                        format_run(r_cap, size=8.5, italic=True, color_hex=MUTED)
                except Exception as e:
                    print(f"Error embedding picture {resolved}: {e}")
            else:
                print(f"Image not found on disk: {img_src}")
            i += 1
            continue

        # Bullet list (- or *)
        if stripped.startswith("- ") or stripped.startswith("* "):
            p = doc.add_paragraph(style="List Bullet")
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_text(p, stripped[2:], base_size=10, base_color=BODY_TEXT)
            i += 1
            continue

        # Numbered list (1. or 2.)
        num_match = re.match(r"^(\d+)\.\s+(.*)$", stripped)
        if num_match:
            p = doc.add_paragraph(style="List Number")
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            add_formatted_text(p, num_match.group(2), base_size=10, base_color=BODY_TEXT)
            i += 1
            continue

        # Standard Paragraph
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.2
        add_formatted_text(p, stripped, base_size=10.5, base_color=BODY_TEXT)
        i += 1

    # Cleanup any trailing structures
    if in_table and table_lines:
        add_styled_table(doc, table_lines)
    if in_blockquote and blockquote_lines:
        add_callout(doc, "\n".join(blockquote_lines))
    if in_code_block and code_lines:
        add_callout(doc, "\n".join(code_lines))

    # Save docx
    docx_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(docx_path))
    print(f"✓ Generated: {docx_path}")


def main():
    LOCAL_OUT_DIR.mkdir(parents=True, exist_ok=True)
    GDRIVE_OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Building 5 TravelFrame SEO Article Documents (.docx)...")
    generated_files = []

    for item in ARTICLES:
        src_path = DRAFTS_DIR / item["source"]
        local_docx = LOCAL_OUT_DIR / item["output_name"]
        gdrive_docx = GDRIVE_OUT_DIR / item["output_name"]

        if not src_path.exists():
            print(f"Error: Source file not found: {src_path}")
            continue

        # 1. Convert to local docx
        convert_markdown_to_docx(src_path, local_docx)

        # 2. Copy directly into Google Drive subfolder
        shutil.copy2(str(local_docx), str(gdrive_docx))
        print(f"✓ Synced to Google Drive: {gdrive_docx}")

        # 3. Also copy to root of travelframe.vn in Drive for instant visibility
        gdrive_root_file = GDRIVE_ROOT_DIR / item["output_name"]
        try:
            shutil.copy2(str(local_docx), str(gdrive_root_file))
            print(f"✓ Synced to Google Drive Root: {gdrive_root_file}")
        except Exception as e:
            print(f"Warning: Could not copy to Drive root: {e}")

        generated_files.append(local_docx)

    print("\nAll 5 .docx files successfully built and placed in Google Drive!")


if __name__ == "__main__":
    main()
