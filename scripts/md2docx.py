"""Convierte el subconjunto de Markdown usado en Docs/ a .docx (python-docx).

Uso: python scripts/md2docx.py <carpeta-de-salida> <archivo.md> [<archivo.md> ...]
"""
import re
import sys
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Inches

INLINE = re.compile(
    r"(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|(?<![\w])_[^_]+_(?![\w])|(?<![\w*])\*[^*\s][^*]*\*(?![\w*]))"
)


def add_inline(par, text, bold=False):
    if "<br>" in text:
        pieces = text.split("<br>")
        for n, piece in enumerate(pieces):
            add_inline(par, piece, bold)
            if n < len(pieces) - 1:
                par.add_run().add_break()
        return
    for part in INLINE.split(text):
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            add_inline(par, part[2:-2], bold=True)
            continue
        run_kwargs = {}
        if part.startswith("`") and part.endswith("`"):
            r = par.add_run(part[1:-1])
            r.font.name = "Consolas"
            r.bold = bold
            continue
        m = re.match(r"\[([^\]]+)\]\(([^)]+)\)", part)
        if m:
            r = par.add_run(m.group(1))
            r.bold = bold
            continue
        if part[0] in "_*" and part.endswith(part[0]) and len(part) > 2:
            r = par.add_run(part[1:-1])
            r.italic = True
            r.bold = bold
            continue
        r = par.add_run(part, **run_kwargs)
        r.bold = bold


def shade(cell, hex_color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tc_pr.append(shd)


def split_row(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def add_table(doc, rows):
    header, body = rows[0], rows[2:]
    table = doc.add_table(rows=1 + len(body), cols=len(header))
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, text in enumerate(header):
        cell = table.rows[0].cells[i]
        cell.paragraphs[0].text = ""
        add_inline(cell.paragraphs[0], text, bold=True)
        shade(cell, "D9E2F3")
    for r, row in enumerate(body, start=1):
        for i in range(len(header)):
            text = row[i] if i < len(row) else ""
            add_inline(table.rows[r].cells[i].paragraphs[0], text)
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                p.paragraph_format.space_after = Pt(0)
                for run in p.runs:
                    run.font.size = Pt(9.5)
    doc.add_paragraph()


def convert(src: Path, dst: Path):
    doc = Document()
    section = doc.sections[0]
    section.page_width, section.page_height = Inches(8.5), Inches(11)
    for side in ("left_margin", "right_margin", "top_margin", "bottom_margin"):
        setattr(section, side, Inches(1))
    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(11)

    lines = src.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        if stripped.startswith("```"):
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                p = doc.add_paragraph()
                p.paragraph_format.space_after = Pt(0)
                r = p.add_run(lines[i])
                r.font.name = "Consolas"
                r.font.size = Pt(9)
                i += 1
            doc.add_paragraph()
            i += 1
            continue
        if stripped.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(split_row(lines[i]))
                i += 1
            add_table(doc, rows)
            continue
        m = re.match(r"(#{1,4})\s+(.*)", stripped)
        if m:
            level = len(m.group(1))
            h = doc.add_heading(level=0 if level == 1 else level - 1)
            add_inline(h, m.group(2))
            i += 1
            continue
        if stripped.startswith(">"):
            text = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                t = lines[i].strip()[1:].strip()
                if t:
                    text.append(t)
                i += 1
            p = doc.add_paragraph(style="Intense Quote")
            add_inline(p, " ".join(text))
            continue
        m = re.match(r"-\s+\[( |x)\]\s+(.*)", stripped)
        if m:
            p = doc.add_paragraph()
            add_inline(p, ("☑ " if m.group(1) == "x" else "☐ ") + m.group(2))
            p.paragraph_format.space_after = Pt(2)
            i += 1
            continue
        m = re.match(r"(-|\d+\.)\s+(.*)", stripped)
        if m:
            style = "List Bullet" if m.group(1) == "-" else "List Number"
            text = m.group(2)
            i += 1
            while (
                i < len(lines)
                and lines[i].startswith("  ")
                and lines[i].strip()
                and not re.match(r"\s*(-|\d+\.)\s", lines[i])
            ):
                text += " " + lines[i].strip()
                i += 1
            add_inline(doc.add_paragraph(style=style), text)
            continue
        text = [stripped]
        i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"\s*(#|\||>|-|\d+\.|```)", lines[i]):
            text.append(lines[i].strip())
            i += 1
        add_inline(doc.add_paragraph(), " ".join(text))

    dst.parent.mkdir(parents=True, exist_ok=True)
    doc.save(dst)


if __name__ == "__main__":
    out_dir = Path(sys.argv[1])
    for src in sys.argv[2:]:
        src = Path(src)
        convert(src, out_dir / (src.stem + ".docx"))
        print("ok", src.name)
