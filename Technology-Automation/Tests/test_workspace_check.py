import importlib.util
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "Technology-Automation" / "Scripts" / "workspace_check.py"


def load_workspace_check():
    spec = importlib.util.spec_from_file_location("workspace_check", SCRIPT)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load {SCRIPT}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class WorkspaceCheckTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.checker = load_workspace_check()

    def test_required_startup_files_exist(self):
        self.assertEqual([], self.checker.check_required_files(ROOT))

    def test_department_readmes_exist(self):
        self.assertEqual([], self.checker.check_department_readmes(ROOT))

    def test_agent_policy_blocks_match(self):
        self.assertEqual([], self.checker.check_agent_policy(ROOT))

    def test_no_tracked_secret_paths(self):
        self.assertEqual([], self.checker.check_tracked_secrets(ROOT))

    def test_legacy_absolute_path_detection(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "active.md").write_text(
                "/Users/macbook/Codex GPT/travelframe.vn/output/file.md\n",
                encoding="utf-8",
            )
            errors = self.checker.check_legacy_absolute_paths(root)
            self.assertEqual(1, len(errors))

    def test_markdown_links_to_local_files_resolve(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "target.md").write_text("# Target\n", encoding="utf-8")
            (root / "ok.md").write_text("[Target](target.md)\n", encoding="utf-8")
            self.assertEqual([], self.checker.check_markdown_links(root))

    def test_vendored_skill_links_are_skipped(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / "skills-lock.json").write_text(
                '{"version": 1, "skills": {"vendor-skill": {}}}', encoding="utf-8"
            )
            vendor = root / ".agents" / "skills" / "vendor-skill"
            vendor.mkdir(parents=True)
            (vendor / "SKILL.md").write_text("[Docs](/features/x)\n", encoding="utf-8")
            own = root / ".agents" / "skills" / "own-skill"
            own.mkdir(parents=True)
            (own / "SKILL.md").write_text("[Missing](missing.md)\n", encoding="utf-8")
            errors = self.checker.check_markdown_links(root)
            self.assertEqual(1, len(errors))
            self.assertIn("own-skill", errors[0])

    def test_local_only_and_scratch_paths_skip_legacy_check(self):
        legacy = "/Users/macbook/Codex GPT/travelframe.vn/x\n"
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            (root / ".claude").mkdir()
            (root / ".claude" / "settings.local.json").write_text(legacy, encoding="utf-8")
            (root / "scratch").mkdir()
            (root / "scratch" / "tool.py").write_text(legacy, encoding="utf-8")
            self.assertEqual([], self.checker.check_legacy_absolute_paths(root))

    def test_skill_governance_files_exist(self):
        self.assertEqual([], self.checker.check_skill_governance_files(ROOT))

    def test_all_department_skill_guides_exist(self):
        self.assertEqual([], self.checker.check_department_skill_guides(ROOT))

    def test_skill_manifest_validates(self):
        self.assertEqual([], self.checker.check_skill_manifest_validates(ROOT))

    def test_agent_skill_mirrors_match(self):
        self.assertEqual([], self.checker.check_skill_mirrors_match(ROOT))


if __name__ == "__main__":
    unittest.main()
