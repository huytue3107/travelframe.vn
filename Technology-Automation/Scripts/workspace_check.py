#!/usr/bin/env python3
"""Deterministic structural checks for the TravelFrame Company OS."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path


REQUIRED_FILES = (
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "WORKSPACE-MAP.md",
    "Executive/Current-State.md",
    "Brand-Strategy/Source-Of-Truth-Map.md",
)

DEPARTMENTS = (
    "Inbox",
    "Executive",
    "Brand-Strategy",
    "Research-Insights",
    "Marketing-Growth",
    "Creative-Production",
    "Sales-CRM",
    "Technology-Automation",
    "Data-Analytics",
    "Operations",
    "Archive",
)

SKILL_GOVERNANCE_FILES = (
    "Technology-Automation/Skills/README.md",
    "Technology-Automation/Skills/Catalog.md",
    "Technology-Automation/Skills/Governance.md",
    "Technology-Automation/Skills/skills-manifest.json",
)

SKILL_DEPARTMENTS = (
    "Executive",
    "Brand-Strategy",
    "Research-Insights",
    "Marketing-Growth",
    "Creative-Production",
    "Sales-CRM",
    "Technology-Automation",
    "Data-Analytics",
    "Operations",
)

TEXT_SUFFIXES = {
    ".css",
    ".html",
    ".js",
    ".json",
    ".md",
    ".mjs",
    ".py",
    ".sh",
    ".srt",
    ".ts",
    ".txt",
    ".vtt",
}

SKIP_PARTS = {
    ".git",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
    ".worktrees",  # sibling git worktrees: gitignored local checkouts, not workspace state
    "Tools",
}

LEGACY_ABSOLUTE_ROOT = "/Users/macbook/Codex GPT/travelframe.vn/"
POLICY_START = "<!-- SHARED-AGENT-POLICY:START -->"
POLICY_END = "<!-- SHARED-AGENT-POLICY:END -->"
MARKDOWN_LINK_RE = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")


def check_required_files(root: Path) -> list[str]:
    return [
        f"missing required file: {relative}"
        for relative in REQUIRED_FILES
        if not (root / relative).is_file()
    ]


def check_department_readmes(root: Path) -> list[str]:
    return [
        f"missing department README: {department}/README.md"
        for department in DEPARTMENTS
        if not (root / department / "README.md").is_file()
    ]


def _policy_block(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    if POLICY_START not in text or POLICY_END not in text:
        raise ValueError(f"shared policy markers missing in {path.name}")
    return text.split(POLICY_START, 1)[1].split(POLICY_END, 1)[0]


def check_agent_policy(root: Path) -> list[str]:
    try:
        agents = _policy_block(root / "AGENTS.md")
        claude = _policy_block(root / "CLAUDE.md")
    except (OSError, ValueError) as exc:
        return [str(exc)]
    if agents != claude:
        return ["AGENTS.md and CLAUDE.md shared policy blocks differ"]
    return []


def check_tracked_secrets(root: Path) -> list[str]:
    result = subprocess.run(
        ["git", "-C", str(root), "ls-files"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return []
    secret_name = re.compile(
        r"(^|/)(\.env($|\.)|credentials?\.|secrets?\.|[^/]+\.(pem|key|p12|pfx)$)",
        re.IGNORECASE,
    )
    return [
        f"tracked secret-like path: {line}"
        for line in result.stdout.splitlines()
        if secret_name.search(line)
    ]


# The checker must not flag its own detection constant or its test fixture.
LEGACY_CHECK_SELF_EXCLUDED = (
    Path("Technology-Automation/Scripts/workspace_check.py"),
    Path("Technology-Automation/Tests/test_workspace_check.py"),
)


def _iter_text_files(root: Path):
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        relative = path.relative_to(root)
        if relative in LEGACY_CHECK_SELF_EXCLUDED:
            continue
        if any(part in SKIP_PARTS for part in relative.parts):
            continue
        if relative.parts[:2] == ("Operations", "Migrations"):
            continue
        if relative.parts[:2] == ("docs", "superpowers"):
            continue
        yield path, relative


def check_legacy_absolute_paths(root: Path) -> list[str]:
    errors = []
    for path, relative in _iter_text_files(root):
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            continue
        for line_number, line in enumerate(lines, start=1):
            if LEGACY_ABSOLUTE_ROOT in line:
                errors.append(
                    f"legacy absolute path: {relative}:{line_number}"
                )
    return errors


def check_markdown_links(root: Path) -> list[str]:
    errors = []
    for path in root.rglob("*.md"):
        relative = path.relative_to(root)
        if any(part in SKIP_PARTS for part in relative.parts):
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for target in MARKDOWN_LINK_RE.findall(text):
            target = target.strip().split("#", 1)[0]
            if not target or "://" in target or target.startswith(("mailto:", "codex:")):
                continue
            target = target.replace("%20", " ")
            resolved = (
                Path(target)
                if Path(target).is_absolute()
                else (path.parent / target).resolve()
            )
            if not resolved.exists():
                errors.append(f"broken markdown link: {relative} -> {target}")
    return errors


def check_skill_governance_files(root: Path) -> list[str]:
    errors = []
    for rel_path in SKILL_GOVERNANCE_FILES:
        if not (root / rel_path).exists():
            errors.append(f"missing skill governance file: {rel_path}")
    return errors


def check_department_skill_guides(root: Path) -> list[str]:
    errors = []
    for dept in SKILL_DEPARTMENTS:
        guide = root / "Technology-Automation" / "Skills" / "Departments" / dept / "README.md"
        if not guide.exists():
            errors.append(f"missing department skill guide: {dept}")
    return errors


def check_skill_manifest_validates(root: Path) -> list[str]:
    validator_script = root / "Technology-Automation" / "Scripts" / "validate_skills.py"
    if not validator_script.exists():
        return ["missing validate_skills.py"]
    res = subprocess.run(
        ["python3", str(validator_script), "--root", str(root), "--json"],
        capture_output=True,
        text=True,
    )
    if res.returncode != 0:
        return [f"skill manifest validation failed: {res.stdout.strip()} {res.stderr.strip()}"]
    return []


def check_skill_mirrors_match(root: Path) -> list[str]:
    sync_script = root / "Technology-Automation" / "Scripts" / "sync_skills.py"
    if not sync_script.exists():
        return ["missing sync_skills.py"]
    res = subprocess.run(
        ["python3", str(sync_script), "--root", str(root), "--check"],
        capture_output=True,
        text=True,
    )
    if res.returncode != 0:
        return [f"skill mirrors drift detected: {res.stdout.strip()} {res.stderr.strip()}"]
    return []


def run_checks(root: Path, allow_legacy_paths: bool) -> int:
    checks = (
        ("required startup files", check_required_files),
        ("department READMEs", check_department_readmes),
        ("agent policy sync", check_agent_policy),
        ("tracked secret paths", check_tracked_secrets),
        ("local markdown links", check_markdown_links),
        ("skill governance files", check_skill_governance_files),
        ("department skill guides", check_department_skill_guides),
        ("skill manifest validation", check_skill_manifest_validates),
        ("skill mirrors match", check_skill_mirrors_match),
    )
    failed = False
    for label, check in checks:
        errors = check(root)
        if errors:
            failed = True
            print(f"FAIL {label}")
            for error in errors:
                print(f"  - {error}")
        else:
            print(f"PASS {label}")

    legacy_errors = check_legacy_absolute_paths(root)
    if legacy_errors and allow_legacy_paths:
        print(f"WARN legacy absolute paths ({len(legacy_errors)})")
    elif legacy_errors:
        failed = True
        print("FAIL legacy absolute paths")
        for error in legacy_errors:
            print(f"  - {error}")
    else:
        print("PASS legacy absolute paths")
    return 1 if failed else 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--allow-legacy-paths", action="store_true")
    args = parser.parse_args()
    return run_checks(args.root.resolve(), args.allow_legacy_paths)


if __name__ == "__main__":
    sys.exit(main())
