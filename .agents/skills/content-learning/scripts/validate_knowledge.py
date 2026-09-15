#!/usr/bin/env python3
"""Validate the knowledge base against references/knowledge-schema.md.

Checks (stdlib only):
- the three core files exist and parse into entries
- entry headers match `## X-NNN | title   (confidence: N nguồn)`
- entry IDs are unique across the whole knowledge base
- every entry carries at least one evidence pointer (a `- Nguồn:` line containing
  a real file path, resolved against --root, default: workspace root)

Exit code: 0 = valid, 1 = invalid, 2 = usage error.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

HEADER_RE = re.compile(
    r"^##\s*([PIV])-(\d+)\s*\|\s*(.+?)\s+\(confidence:\s*(\d+)\s+nguồn\)\s*$", re.M)
POINTER_RE = re.compile(r"^- Nguồn:\s*(.+)$", re.M)
PATH_TOKEN_RE = re.compile(r"[^\s,]+(?:/[^\s,]+)+\.(?:md|txt|json|html)\b")

VOICE_SECTIONS = ("Giọng & xưng hô", "Cấu trúc câu", "Emoji & ký hiệu",
                  "CTA chuẩn", "Hashtag & ký tên", "Cấm (guardrails)")
CORE_FILES = ("voice-playbook.md", "patterns.md", "ideas-backlog.md")




def entry_blocks(text: str) -> list[tuple[str, str]]:
    """Yield (entry_id, block body) for each header in a knowledge file."""
    matches = list(HEADER_RE.finditer(text))
    blocks = []
    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        blocks.append((f"{m.group(1)}-{int(m.group(2)):03d}", text[start:end]))
    return blocks


def pointer_targets(block: str) -> list[str]:
    targets = []
    for line in block.splitlines():
        if line.startswith("- Nguồn:"):
            targets.extend(PATH_TOKEN_RE.findall(line))
    return targets


def validate(knowledge_dir: Path, root: Path) -> dict:
    errors: list[str] = []
    entry_counts: dict[str, int] = {}
    seen: dict[str, str] = {}

    for name in CORE_FILES:
        path = knowledge_dir / name
        if not path.is_file():
            errors.append(f"missing core file: {name}")
            continue
        text = path.read_text(encoding="utf-8")
        headers = HEADER_RE.findall(text)
        entry_counts[name] = len(headers)
        for entry_id, block in entry_blocks(text):
            if entry_id in seen:
                errors.append(f"duplicate entry ID {entry_id}: {name} + {seen[entry_id]}")
            seen[entry_id] = name
            targets = pointer_targets(block)
            if not targets:
                errors.append(f"{entry_id} in {name}: no `- Nguồn:` evidence pointer")
                continue
            for target in targets:
                if not (root / target).exists():
                    errors.append(f"{entry_id}: evidence pointer target missing on disk: "
                                  f"{target}")

    voice = knowledge_dir / "voice-playbook.md"
    if voice.is_file():
        voice_text = voice.read_text(encoding="utf-8")
        for section in VOICE_SECTIONS:
            if section not in voice_text:
                errors.append(f"voice-playbook.md missing section: {section}")

    return {
        "knowledge_dir": str(knowledge_dir),
        "root": str(root),
        "entry_counts": entry_counts,
        "entries_total": sum(entry_counts.values()),
        "errors": errors,
        "valid": not errors,
    }


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--knowledge", required=True, help="knowledge base directory")
    parser.add_argument("--root", default="/Users/macbook/Codex GPT/travelframe.vn",
                        help="workspace root for resolving evidence pointers")
    args = parser.parse_args(argv)
    knowledge_dir = Path(args.knowledge)
    if not knowledge_dir.is_dir():
        print(json.dumps({"error": f"knowledge dir not found: {knowledge_dir}"}))
        return 2
    verdict = validate(knowledge_dir, Path(args.root))
    print(json.dumps(verdict, indent=2, ensure_ascii=False))
    return 0 if verdict["valid"] else 1


if __name__ == "__main__":
    sys.exit(main())
