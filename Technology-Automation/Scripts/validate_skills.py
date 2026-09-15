#!/usr/bin/env python3
"""
TravelFrame Skills Validator
Kiểm tra tính toàn vẹn của skills-manifest.json và contract của các SKILL.md.
Sử dụng chuẩn thư viện chuẩn Python 3.
"""

import sys
import os
import json
import re
import argparse
from pathlib import Path

VALID_DEPARTMENTS = [
    "Executive",
    "Brand-Strategy",
    "Research-Insights",
    "Marketing-Growth",
    "Creative-Production",
    "Sales-CRM",
    "Technology-Automation",
    "Data-Analytics",
    "Operations",
]

VALID_STATUSES = ["active", "pilot", "paused", "deprecated"]

REQUIRED_SECTIONS = [
    "Purpose",
    "Read First",
    "Inputs",
    "Workflow",
    "Output",
    "Approval Gates",
    "Guardrails",
    "Completion Criteria",
]

ABSOLUTE_PATH_PATTERNS = [
    re.compile(r"(/Users/[^\s\)\"\'`]+)"),
    re.compile(r"(/home/[^\s\)\"\'`]+)"),
    re.compile(r"([A-Za-z]:\\[^\s\)\"\'`]+)"),
    re.compile(r"(/var/[^\s\)\"\'`]+)"),
    re.compile(r"(/tmp/[^\s\)\"\'`]+)"),
]


def parse_frontmatter(content: str):
    if not content.startswith("---"):
        return None, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, content
    raw_fm = parts[1]
    body = parts[2]
    meta = {}
    for line in raw_fm.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip("\"'")
    return meta, body


def validate(root_dir: Path):
    errors = []
    warnings = []
    checks_count = 0

    manifest_path = root_dir / "Technology-Automation" / "Skills" / "skills-manifest.json"
    checks_count += 1
    if not manifest_path.exists():
        errors.append(f"skills-manifest.json does not exist at {manifest_path}")
        return errors, warnings, checks_count

    try:
        with open(manifest_path, "r", encoding="utf-8") as fp:
            manifest = json.load(fp)
    except Exception as e:
        errors.append(f"Invalid JSON in skills-manifest.json: {e}")
        return errors, warnings, checks_count

    schema_version = manifest.get("schema_version")
    checks_count += 1
    if not schema_version:
        errors.append("skills-manifest.json missing schema_version")

    skills = manifest.get("skills", [])
    checks_count += 1
    if not isinstance(skills, list):
        errors.append("'skills' in manifest must be a list")
        return errors, warnings, checks_count

    seen_names = set()

    for idx, skill in enumerate(skills):
        name = skill.get("name")
        owner = skill.get("owner")
        status = skill.get("status")
        source_type = skill.get("source_type")
        canonical_path_str = skill.get("canonical_path")
        deploy_targets = skill.get("deploy_targets", [])
        approval_gates = skill.get("approval_gates", [])
        live_write = skill.get("live_write", False)
        contract = skill.get("contract")

        checks_count += 1
        if not name:
            errors.append(f"Skill #{idx} missing 'name'")
            continue

        checks_count += 1
        if name in seen_names:
            errors.append(f"Duplicate skill name: '{name}'")
        seen_names.add(name)

        checks_count += 1
        if owner not in VALID_DEPARTMENTS:
            errors.append(f"Unknown owner: '{owner}' for skill '{name}'. Must be one of {VALID_DEPARTMENTS}")

        checks_count += 1
        if status not in VALID_STATUSES:
            errors.append(f"Invalid status: '{status}' for skill '{name}'. Must be one of {VALID_STATUSES}")

        checks_count += 1
        if not canonical_path_str:
            errors.append(f"Skill '{name}' missing canonical_path")
        else:
            canonical_path = root_dir / canonical_path_str
            if not canonical_path.exists() or not canonical_path.is_dir():
                errors.append(f"Canonical path does not exist: '{canonical_path_str}' for skill '{name}'")

        checks_count += 1
        if not isinstance(deploy_targets, list):
            errors.append(f"deploy_targets for skill '{name}' must be a list")
        else:
            for dt in deploy_targets:
                if not dt.startswith(".claude/skills/"):
                    errors.append(f"Deploy target must start with .claude/skills/: '{dt}' in skill '{name}'")

        checks_count += 1
        if source_type == "external":
            s_url = skill.get("source_url")
            s_commit = skill.get("source_commit")
            s_lic = skill.get("license")
            if not s_url or not s_commit or not s_lic:
                errors.append(
                    f"External skill requires source metadata (source_url, source_commit, license) for skill '{name}'"
                )

        checks_count += 1
        if live_write:
            if not approval_gates or len(approval_gates) == 0:
                errors.append(f"Skill with live write requires approval gate: '{name}'")

        # Validate SKILL.md if canonical path exists
        if canonical_path_str:
            skill_md_path = root_dir / canonical_path_str / "SKILL.md"
            if skill_md_path.exists():
                try:
                    with open(skill_md_path, "r", encoding="utf-8") as fp:
                        content = fp.read()
                except Exception as e:
                    errors.append(f"Failed to read {skill_md_path}: {e}")
                    continue

                checks_count += 1
                fm, body = parse_frontmatter(content)
                if fm is None:
                    errors.append(f"Missing YAML frontmatter in {skill_md_path}")
                else:
                    fm_name = fm.get("name")
                    fm_desc = fm.get("description")
                    if not fm_name or not fm_desc:
                        errors.append(f"SKILL.md missing name or description in frontmatter at {skill_md_path}")
                    else:
                        checks_count += 1
                        # Check description starts with condition unless legacy
                        if contract != "legacy":
                            if not (fm_desc.lower().startswith("use when") or fm_desc.lower().startswith("dùng khi")):
                                errors.append(
                                    f"Skill description must start with use condition ('Use when') at {skill_md_path}"
                                )

                # Check sections unless contract is marked legacy
                checks_count += 1
                if contract != "legacy":
                    for sec in REQUIRED_SECTIONS:
                        pattern = re.compile(rf"^##\s+{re.escape(sec)}\b", re.MULTILINE)
                        if not pattern.search(content):
                            errors.append(f"SKILL.md missing required section: '{sec}' at {skill_md_path}")

                # Check absolute paths
                checks_count += 1
                for pat in ABSOLUTE_PATH_PATTERNS:
                    match = pat.search(content)
                    if match:
                        errors.append(
                            f"Skill paths must be project relative, found absolute path: '{match.group(0)}' at {skill_md_path}"
                        )
                        break

    return errors, warnings, checks_count


def main():
    parser = argparse.ArgumentParser(description="TravelFrame Skills Validator")
    parser.add_argument("--root", default=".", help="Root directory of repository")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    errors, warnings, checks = validate(root)

    status = "pass" if len(errors) == 0 else "fail"

    if args.json:
        result = {
            "status": status,
            "checks": checks,
            "errors": errors,
            "warnings": warnings,
        }
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"=== TravelFrame Skills Validation ({status.upper()}) ===")
        print(f"Total checks performed: {checks}")
        if warnings:
            print("\nWARNINGS:")
            for w in warnings:
                print(f"  - {w}")
        if errors:
            print("\nERRORS:")
            for e in errors:
                print(f"  - {e}")
            sys.exit(1)
        else:
            print("\nAll skill contracts and manifest checks PASSED.")

    if len(errors) > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
