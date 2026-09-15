import os
import json
import tempfile
import subprocess
import unittest
from pathlib import Path

class TestSkillSync(unittest.TestCase):
    def setUp(self):
        self.repo_root = Path(__file__).resolve().parent.parent.parent
        self.sync_script = self.repo_root / "Technology-Automation" / "Scripts" / "sync_skills.py"

    def run_sync(self, root_dir, mode="--check"):
        cmd = ["python3", str(self.sync_script), "--root", str(root_dir), mode]
        res = subprocess.run(cmd, capture_output=True, text=True)
        return res.returncode, res.stdout, res.stderr

    def create_fixture(self):
        td = tempfile.TemporaryDirectory()
        root = Path(td.name)

        # setup directory structure
        agents_dir = root / ".agents" / "skills"
        claude_dir = root / ".claude" / "skills"
        skills_dir = root / "Technology-Automation" / "Skills"

        agents_dir.mkdir(parents=True, exist_ok=True)
        claude_dir.mkdir(parents=True, exist_ok=True)
        skills_dir.mkdir(parents=True, exist_ok=True)

        return td, root

    def test_sync_copies_only_manifest_managed_skills(self):
        td, root = self.create_fixture()

        # Skill 1: managed
        s1 = root / ".agents" / "skills" / "managed-skill"
        s1.mkdir(parents=True, exist_ok=True)
        with open(s1 / "SKILL.md", "w") as fp:
            fp.write("managed content")

        # Skill 2: unmanaged
        s2 = root / ".agents" / "skills" / "unmanaged-skill"
        s2.mkdir(parents=True, exist_ok=True)
        with open(s2 / "SKILL.md", "w") as fp:
            fp.write("unmanaged content")

        manifest = {
            "schema_version": 1,
            "canonical_root": ".agents/skills",
            "mirror_roots": [".claude/skills"],
            "skills": [
                {
                    "name": "managed-skill",
                    "owner": "Executive",
                    "status": "active",
                    "canonical_path": ".agents/skills/managed-skill",
                    "deploy_targets": [".claude/skills/managed-skill"]
                }
            ]
        }
        with open(root / "Technology-Automation" / "Skills" / "skills-manifest.json", "w") as fp:
            json.dump(manifest, fp)

        code, out, err = self.run_sync(root, "--write")
        self.assertEqual(code, 0)

        # Check claude/skills
        target_managed = root / ".claude" / "skills" / "managed-skill" / "SKILL.md"
        target_unmanaged = root / ".claude" / "skills" / "unmanaged-skill"

        self.assertTrue(target_managed.exists())
        self.assertFalse(target_unmanaged.exists())

        td.cleanup()

    def test_sync_preserves_unmanaged_target_skill(self):
        td, root = self.create_fixture()

        # managed in source
        s1 = root / ".agents" / "skills" / "managed-skill"
        s1.mkdir(parents=True, exist_ok=True)
        with open(s1 / "SKILL.md", "w") as fp:
            fp.write("managed content")

        # unmanaged folder already in target mirror
        unmanaged_target = root / ".claude" / "skills" / "custom-target-skill"
        unmanaged_target.mkdir(parents=True, exist_ok=True)
        with open(unmanaged_target / "NOTE.txt", "w") as fp:
            fp.write("should not be deleted")

        manifest = {
            "schema_version": 1,
            "canonical_root": ".agents/skills",
            "mirror_roots": [".claude/skills"],
            "skills": [
                {
                    "name": "managed-skill",
                    "owner": "Executive",
                    "status": "active",
                    "canonical_path": ".agents/skills/managed-skill",
                    "deploy_targets": [".claude/skills/managed-skill"]
                }
            ]
        }
        with open(root / "Technology-Automation" / "Skills" / "skills-manifest.json", "w") as fp:
            json.dump(manifest, fp)

        code, out, err = self.run_sync(root, "--write")
        self.assertEqual(code, 0)

        # target unmanaged file still exists untouched
        self.assertTrue((unmanaged_target / "NOTE.txt").exists())
        with open(unmanaged_target / "NOTE.txt", "r") as fp:
            self.assertEqual(fp.read(), "should not be deleted")

        td.cleanup()

    def test_check_mode_reports_changed_file(self):
        td, root = self.create_fixture()

        s1 = root / ".agents" / "skills" / "managed-skill"
        s1.mkdir(parents=True, exist_ok=True)
        with open(s1 / "SKILL.md", "w") as fp:
            fp.write("version 1")

        t1 = root / ".claude" / "skills" / "managed-skill"
        t1.mkdir(parents=True, exist_ok=True)
        with open(t1 / "SKILL.md", "w") as fp:
            fp.write("version 2 modified")

        manifest = {
            "schema_version": 1,
            "canonical_root": ".agents/skills",
            "mirror_roots": [".claude/skills"],
            "skills": [
                {
                    "name": "managed-skill",
                    "owner": "Executive",
                    "status": "active",
                    "canonical_path": ".agents/skills/managed-skill",
                    "deploy_targets": [".claude/skills/managed-skill"]
                }
            ]
        }
        with open(root / "Technology-Automation" / "Skills" / "skills-manifest.json", "w") as fp:
            json.dump(manifest, fp)

        code, out, err = self.run_sync(root, "--check")
        self.assertEqual(code, 1)
        self.assertTrue("diff" in (out + err).lower() or "drift" in (out + err).lower() or "managed-skill" in (out + err))

        # Check mode should NOT have modified the file
        with open(t1 / "SKILL.md", "r") as fp:
            self.assertEqual(fp.read(), "version 2 modified")

        td.cleanup()

    def test_sync_excludes_cache_and_ds_store(self):
        td, root = self.create_fixture()

        s1 = root / ".agents" / "skills" / "managed-skill"
        s1.mkdir(parents=True, exist_ok=True)
        with open(s1 / "SKILL.md", "w") as fp:
            fp.write("valid content")
        with open(s1 / ".DS_Store", "w") as fp:
            fp.write("garbage")

        pycache = s1 / "__pycache__"
        pycache.mkdir(parents=True, exist_ok=True)
        with open(pycache / "module.cpython-312.pyc", "w") as fp:
            fp.write("compiled bytecode")

        manifest = {
            "schema_version": 1,
            "canonical_root": ".agents/skills",
            "mirror_roots": [".claude/skills"],
            "skills": [
                {
                    "name": "managed-skill",
                    "owner": "Executive",
                    "status": "active",
                    "canonical_path": ".agents/skills/managed-skill",
                    "deploy_targets": [".claude/skills/managed-skill"]
                }
            ]
        }
        with open(root / "Technology-Automation" / "Skills" / "skills-manifest.json", "w") as fp:
            json.dump(manifest, fp)

        code, out, err = self.run_sync(root, "--write")
        self.assertEqual(code, 0)

        target_skill = root / ".claude" / "skills" / "managed-skill"
        self.assertTrue((target_skill / "SKILL.md").exists())
        self.assertFalse((target_skill / ".DS_Store").exists())
        self.assertFalse((target_skill / "__pycache__").exists())

        td.cleanup()

    def test_sync_removes_stale_file_inside_managed_skill_only(self):
        td, root = self.create_fixture()

        s1 = root / ".agents" / "skills" / "managed-skill"
        s1.mkdir(parents=True, exist_ok=True)
        with open(s1 / "SKILL.md", "w") as fp:
            fp.write("valid content")

        # target has stale file
        t1 = root / ".claude" / "skills" / "managed-skill"
        t1.mkdir(parents=True, exist_ok=True)
        with open(t1 / "SKILL.md", "w") as fp:
            fp.write("valid content")
        with open(t1 / "stale-deleted-file.txt", "w") as fp:
            fp.write("old file")

        manifest = {
            "schema_version": 1,
            "canonical_root": ".agents/skills",
            "mirror_roots": [".claude/skills"],
            "skills": [
                {
                    "name": "managed-skill",
                    "owner": "Executive",
                    "status": "active",
                    "canonical_path": ".agents/skills/managed-skill",
                    "deploy_targets": [".claude/skills/managed-skill"]
                }
            ]
        }
        with open(root / "Technology-Automation" / "Skills" / "skills-manifest.json", "w") as fp:
            json.dump(manifest, fp)

        code, out, err = self.run_sync(root, "--write")
        self.assertEqual(code, 0)

        # stale file inside managed target must be removed
        self.assertFalse((t1 / "stale-deleted-file.txt").exists())
        self.assertTrue((t1 / "SKILL.md").exists())

        td.cleanup()

if __name__ == "__main__":
    unittest.main()
