import os
import json
import tempfile
import subprocess
import unittest
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

class TestSkillManifest(unittest.TestCase):
    def setUp(self):
        self.repo_root = Path(__file__).resolve().parent.parent.parent
        self.validator_script = self.repo_root / "Technology-Automation" / "Scripts" / "validate_skills.py"

    def run_validator(self, root_dir):
        cmd = ["python3", str(self.validator_script), "--root", str(root_dir), "--json"]
        res = subprocess.run(cmd, capture_output=True, text=True)
        try:
            data = json.loads(res.stdout) if res.stdout.strip() else {}
        except Exception:
            data = {"raw_stdout": res.stdout, "raw_stderr": res.stderr}
        return res.returncode, data, res.stderr + res.stdout

    def create_fixture(self, manifest_data, create_paths=None):
        td = tempfile.TemporaryDirectory()
        root = Path(td.name)
        skills_dir = root / "Technology-Automation" / "Skills"
        skills_dir.mkdir(parents=True, exist_ok=True)
        manifest_path = skills_dir / "skills-manifest.json"
        with open(manifest_path, "w", encoding="utf-8") as fp:
            json.dump(manifest_data, fp, indent=2)

        if create_paths:
            for p in create_paths:
                target = root / p
                target.mkdir(parents=True, exist_ok=True)
                # create minimal dummy SKILL.md
                skill_md = target / "SKILL.md"
                with open(skill_md, "w", encoding="utf-8") as fp:
                    fp.write("---\nname: dummy\ndescription: Use when testing.\n---\n# Dummy\n## Purpose\n## Read First\n## Inputs\n## Workflow\n## Output\n## Approval Gates\n## Guardrails\n## Completion Criteria\n")

        return td, root

    def test_rejects_duplicate_skill_names(self):
        manifest = {
            "schema_version": 1,
            "skills": [
                {
                    "name": "dup-skill",
                    "owner": "Executive",
                    "status": "active",
                    "source_type": "custom",
                    "canonical_path": ".agents/skills/dup-skill",
                    "deploy_targets": [".claude/skills/dup-skill"],
                    "approval_gates": []
                },
                {
                    "name": "dup-skill",
                    "owner": "Operations",
                    "status": "active",
                    "source_type": "custom",
                    "canonical_path": ".agents/skills/dup-skill-2",
                    "deploy_targets": [".claude/skills/dup-skill-2"],
                    "approval_gates": []
                }
            ]
        }
        td, root = self.create_fixture(manifest, [".agents/skills/dup-skill", ".agents/skills/dup-skill-2"])
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertIn("duplicate skill name", output.lower())

    def test_rejects_unknown_department_owner(self):
        manifest = {
            "schema_version": 1,
            "skills": [
                {
                    "name": "finance-skill",
                    "owner": "Finance",
                    "status": "active",
                    "source_type": "custom",
                    "canonical_path": ".agents/skills/finance-skill",
                    "deploy_targets": [".claude/skills/finance-skill"],
                    "approval_gates": []
                }
            ]
        }
        td, root = self.create_fixture(manifest, [".agents/skills/finance-skill"])
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertIn("unknown owner", output.lower())

    def test_requires_source_metadata_for_external_skill(self):
        manifest = {
            "schema_version": 1,
            "skills": [
                {
                    "name": "ext-skill",
                    "owner": "Research-Insights",
                    "status": "active",
                    "source_type": "external",
                    "source_url": None,
                    "source_commit": None,
                    "license": None,
                    "canonical_path": ".agents/skills/ext-skill",
                    "deploy_targets": [".claude/skills/ext-skill"],
                    "approval_gates": []
                }
            ]
        }
        td, root = self.create_fixture(manifest, [".agents/skills/ext-skill"])
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertTrue(
            "source metadata" in output.lower() or
            "source_url" in output.lower() or
            "external" in output.lower()
        )

    def test_requires_approval_gate_for_live_actions(self):
        manifest = {
            "schema_version": 1,
            "skills": [
                {
                    "name": "live-action-skill",
                    "owner": "Operations",
                    "status": "active",
                    "source_type": "custom",
                    "canonical_path": ".agents/skills/live-action-skill",
                    "deploy_targets": [".claude/skills/live-action-skill"],
                    "live_write": True,
                    "approval_gates": []
                }
            ]
        }
        td, root = self.create_fixture(manifest, [".agents/skills/live-action-skill"])
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertTrue("approval" in output.lower() or "gate" in output.lower())

    def test_requires_existing_canonical_path(self):
        manifest = {
            "schema_version": 1,
            "skills": [
                {
                    "name": "missing-path-skill",
                    "owner": "Operations",
                    "status": "active",
                    "source_type": "custom",
                    "canonical_path": ".agents/skills/non-existent-skill",
                    "deploy_targets": [".claude/skills/non-existent-skill"],
                    "approval_gates": []
                }
            ]
        }
        td, root = self.create_fixture(manifest, create_paths=[])
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertTrue(
            "canonical path" in output.lower() or
            "non-existent-skill" in output.lower() or
            "does not exist" in output.lower()
        )

if __name__ == "__main__":
    unittest.main()
