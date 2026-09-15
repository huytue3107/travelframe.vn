#!/usr/bin/env python3
"""
TravelFrame Skills Sync Tool
Đồng bộ kỹ năng từ canonical source (.agents/skills/) sang deploy target (.claude/skills/)
dựa trên Technology-Automation/Skills/skills-manifest.json.
"""

import sys
import os
import json
import shutil
import hashlib
import argparse
from pathlib import Path

EXCLUDED_FILENAMES = {".DS_Store"}
EXCLUDED_DIRNAMES = {"__pycache__"}
EXCLUDED_EXTENSIONS = {".pyc"}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fp:
        while chunk := fp.read(65536):
            h.update(chunk)
    return h.hexdigest()


def scan_skill_files(dir_path: Path):
    """Quét tất cả các file hợp lệ trong thư mục skill, trả về dict rel_path -> sha256."""
    files_map = {}
    if not dir_path.exists():
        return files_map

    for root, dirs, files in os.walk(dir_path):
        # Lọc bỏ thư mục cache tại chỗ
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRNAMES]

        for f in files:
            if f in EXCLUDED_FILENAMES:
                continue
            if any(f.endswith(ext) for ext in EXCLUDED_EXTENSIONS):
                continue

            full_p = Path(root) / f
            # Kiểm tra symlink ra ngoài project
            if full_p.is_symlink():
                continue

            rel_p = full_p.relative_to(dir_path).as_posix()
            files_map[rel_p] = sha256_file(full_p)

    return files_map


def sync_skills(root_dir: Path, mode: str):
    manifest_path = root_dir / "Technology-Automation" / "Skills" / "skills-manifest.json"
    if not manifest_path.exists():
        print(f"Error: manifest not found at {manifest_path}", file=sys.stderr)
        return 1

    with open(manifest_path, "r", encoding="utf-8") as fp:
        manifest = json.load(fp)

    skills = manifest.get("skills", [])
    has_drift = False

    total_added = 0
    total_updated = 0
    total_removed = 0
    total_unchanged = 0

    print(f"=== TravelFrame Skills Sync (Mode: {mode.upper()}) ===")

    for skill in skills:
        name = skill.get("name")
        canonical_rel = skill.get("canonical_path")
        deploy_targets = skill.get("deploy_targets", [])

        if not canonical_rel or not deploy_targets:
            continue

        canonical_path = root_dir / canonical_rel
        if not canonical_path.exists():
            print(f"Warning: Canonical path {canonical_rel} not found for skill '{name}'", file=sys.stderr)
            continue

        source_files = scan_skill_files(canonical_path)

        for target_rel in deploy_targets:
            target_path = root_dir / target_rel
            target_files = scan_skill_files(target_path)

            to_add = []
            to_update = []
            to_remove = []
            unchanged = []

            for rel_file, s_hash in source_files.items():
                if rel_file not in target_files:
                    to_add.append(rel_file)
                elif target_files[rel_file] != s_hash:
                    to_update.append(rel_file)
                else:
                    unchanged.append(rel_file)

            for rel_file in target_files:
                if rel_file not in source_files:
                    to_remove.append(rel_file)

            if to_add or to_update or to_remove:
                has_drift = True
                print(f"\n[Drift Detected] Skill '{name}' -> {target_rel}:")
                for f in to_add:
                    print(f"  + Missing in target: {f}")
                for f in to_update:
                    print(f"  ~ Content modified: {f}")
                for f in to_remove:
                    print(f"  - Stale in target:   {f}")

                if mode == "write":
                    target_path.mkdir(parents=True, exist_ok=True)
                    # Copy added & updated
                    for f in to_add + to_update:
                        s_file = canonical_path / f
                        t_file = target_path / f
                        t_file.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(s_file, t_file)

                    # Remove stale files
                    for f in to_remove:
                        t_file = target_path / f
                        if t_file.exists():
                            t_file.unlink()

                    # Clean empty dirs in target
                    for root, dirs, files in os.walk(target_path, topdown=False):
                        for d in dirs:
                            dp = Path(root) / d
                            if dp.exists() and not any(dp.iterdir()):
                                dp.rmdir()

                    total_added += len(to_add)
                    total_updated += len(to_update)
                    total_removed += len(to_remove)
            else:
                total_unchanged += len(unchanged)

    if mode == "check":
        if has_drift:
            print("\nDrift detected! Run 'python3 Technology-Automation/Scripts/sync_skills.py --write' to synchronize.")
            return 1
        else:
            print("\nAll managed skills are in perfect synchronization. No drift detected.")
            return 0
    else:
        print("\n=== Sync Summary ===")
        print(f"Added: {total_added} | Updated: {total_updated} | Removed: {total_removed} | Unchanged: {total_unchanged}")
        print("Managed skills synchronized successfully.")
        return 0


def main():
    parser = argparse.ArgumentParser(description="TravelFrame Skills Sync Tool")
    parser.add_argument("--root", default=".", help="Root directory of repository")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--check", action="store_true", help="Check for drift without modifying files (default)")
    group.add_argument("--write", action="store_true", help="Write updates to deploy targets")

    args = parser.parse_args()
    root = Path(args.root).resolve()
    mode = "write" if args.write else "check"

    code = sync_skills(root, mode)
    sys.exit(code)


if __name__ == "__main__":
    main()
