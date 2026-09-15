import os
import json
import tempfile
import subprocess
import unittest
from pathlib import Path

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

NEW_SKILLS_LIST = [
    "executive-decision-record",
    "executive-operating-review",
    "offer-governance",
    "customer-evidence-synthesis",
    "campaign-brief",
    "creative-production-qa",
    "lead-qualification",
    "manychat-flow-review",
    "integration-design",
    "web-experience-qa",
    "campaign-performance-report",
    "sop-change-control",
]

class TestSkillContracts(unittest.TestCase):
    def setUp(self):
        self.repo_root = Path(__file__).resolve().parent.parent.parent
        self.validator_script = self.repo_root / "Technology-Automation" / "Scripts" / "validate_skills.py"
        self.scenarios_file = self.repo_root / "Technology-Automation" / "Skills" / "Tests" / "activation-scenarios.json"

    def run_validator(self, root_dir):
        cmd = ["python3", str(self.validator_script), "--root", str(root_dir), "--json"]
        res = subprocess.run(cmd, capture_output=True, text=True)
        try:
            data = json.loads(res.stdout) if res.stdout.strip() else {}
        except Exception:
            data = {"raw_stdout": res.stdout, "raw_stderr": res.stderr}
        return res.returncode, data, res.stderr + res.stdout

    def create_fixture_with_skill(self, skill_name, skill_content, manifest_extra=None):
        td = tempfile.TemporaryDirectory()
        root = Path(td.name)
        skills_dir = root / "Technology-Automation" / "Skills"
        skills_dir.mkdir(parents=True, exist_ok=True)
        manifest_path = skills_dir / "skills-manifest.json"

        skill_dir = root / ".agents" / "skills" / skill_name
        skill_dir.mkdir(parents=True, exist_ok=True)
        with open(skill_dir / "SKILL.md", "w", encoding="utf-8") as fp:
            fp.write(skill_content)

        manifest = {
            "schema_version": 1,
            "skills": [
                {
                    "name": skill_name,
                    "owner": "Executive",
                    "status": "active",
                    "source_type": "custom",
                    "canonical_path": f".agents/skills/{skill_name}",
                    "deploy_targets": [f".claude/skills/{skill_name}"],
                    "approval_gates": []
                }
            ]
        }
        if manifest_extra:
            manifest["skills"][0].update(manifest_extra)

        with open(manifest_path, "w", encoding="utf-8") as fp:
            json.dump(manifest, fp, indent=2)

        return td, root

    def test_skill_requires_frontmatter_name_and_description(self):
        # Content missing description in frontmatter
        content = "---\nname: test-skill\n---\n# Test\n" + "\n".join([f"## {s}\n" for s in REQUIRED_SECTIONS])
        td, root = self.create_fixture_with_skill("test-skill", content)
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertTrue("description" in output.lower() or "frontmatter" in output.lower())

    def test_skill_requires_all_contract_sections(self):
        # Content missing 'Approval Gates'
        missing_section = "Approval Gates"
        sections = [s for s in REQUIRED_SECTIONS if s != missing_section]
        content = "---\nname: test-skill\ndescription: Use when testing contract sections.\n---\n# Test\n" + "\n".join([f"## {s}\n" for s in sections])
        td, root = self.create_fixture_with_skill("test-skill", content)
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertIn("approval gates", output.lower())

    def test_skill_description_starts_with_use_condition(self):
        # Description not starting with use condition
        content = "---\nname: test-skill\ndescription: A tool that does something.\n---\n# Test\n" + "\n".join([f"## {s}\n" for s in REQUIRED_SECTIONS])
        td, root = self.create_fixture_with_skill("test-skill", content)
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertTrue("use when" in output.lower() or "condition" in output.lower())

    def test_skill_paths_are_project_relative(self):
        # Content with absolute path
        content = "---\nname: test-skill\ndescription: Use when testing path relativism.\n---\n# Test\n## Purpose\n## Read First\n- /Users/macbook/some/abs/path.md\n## Inputs\n## Workflow\n## Output\n## Approval Gates\n## Guardrails\n## Completion Criteria\n"
        td, root = self.create_fixture_with_skill("test-skill", content)
        code, data, output = self.run_validator(root)
        td.cleanup()
        self.assertEqual(code, 1)
        self.assertTrue("relative" in output.lower() or "absolute" in output.lower())

    def test_each_new_skill_has_required_scenario_types(self):
        if not self.scenarios_file.exists():
            self.fail(f"Scenarios file {self.scenarios_file} does not exist.")

        with open(self.scenarios_file, "r", encoding="utf-8") as fp:
            data = json.load(fp)

        scenarios = data.get("scenarios", [])
        for skill in NEW_SKILLS_LIST:
            skill_scenarios = [s for s in scenarios if s.get("expected_skill") == skill]
            types = {s.get("scenario_type") for s in skill_scenarios}
            positive_count = sum(1 for s in skill_scenarios if s.get("scenario_type") == "positive")

            self.assertGreaterEqual(
                positive_count, 2,
                f"Skill '{skill}' must have at least 2 positive scenarios, found {positive_count}"
            )
            self.assertIn(
                "near-miss", types,
                f"Skill '{skill}' must have at least 1 near-miss scenario"
            )
            self.assertIn(
                "pressure", types,
                f"Skill '{skill}' must have at least 1 pressure scenario"
            )
            self.assertIn(
                "missing-data", types,
                f"Skill '{skill}' must have at least 1 missing-data scenario"
            )

if __name__ == "__main__":
    unittest.main()
