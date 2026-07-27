import json
import tempfile
import unittest
from pathlib import Path

from tools.cgpa_audit import audit, load_config, render_markdown


class CgpaAuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.config = {
            "schema_version": 1,
            "framework_version": "6.1.1",
            "required_paths": ["README.md", "docs/target.md"],
            "required_content": {"README.md": ["CGPA v6.1.1"]},
            "markdown_link_scopes": ["README.md", "docs"],
            "active_text_paths": ["README.md"],
            "mojibake_markers": ["\u00c3"],
        }
        self.write("README.md", "# CGPA v6.1.1\n\n[Target](docs/target.md)\n")
        self.write("docs/target.md", "# Target\n")

    def tearDown(self):
        self.temp.cleanup()

    def write(self, relative, content):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def run_audit(self, tracked=None):
        return audit(
            self.root,
            self.config,
            tracked_paths=tracked or ["README.md", "docs/target.md"],
        )

    def test_valid_repository_passes(self):
        result = self.run_audit()
        self.assertEqual("PASS", result["audit_status"])
        self.assertEqual(0, result["summary"]["failed"])

    def test_missing_required_path_fails(self):
        result = self.run_audit(["README.md"])
        self.assertEqual("FAIL", result["audit_status"])
        self.assertTrue(
            any(
                item["check"] == "required-path" and item["status"] == "FAIL"
                for item in result["findings"]
            )
        )

    def test_wrong_case_link_fails(self):
        self.write("README.md", "# CGPA v6.1.1\n\n[Target](docs/Target.md)\n")
        result = self.run_audit()
        self.assertEqual("FAIL", result["audit_status"])
        self.assertTrue(
            any(
                item["check"] == "markdown-links" and item["status"] == "FAIL"
                for item in result["findings"]
            )
        )

    def test_missing_tracked_markdown_is_reported(self):
        result = self.run_audit(
            ["README.md", "docs/target.md", "docs/missing.md"]
        )
        self.assertEqual("FAIL", result["audit_status"])
        self.assertTrue(
            any(
                item["check"] == "markdown-links"
                and "tracked Markdown source is missing" in item["message"]
                for item in result["findings"]
            )
        )

    def test_missing_required_marker_fails(self):
        self.write("README.md", "# CGPA\n")
        result = self.run_audit()
        self.assertEqual("FAIL", result["audit_status"])

    def test_case_collision_fails(self):
        result = self.run_audit(
            ["README.md", "docs/target.md", "docs/TARGET.md"]
        )
        self.assertEqual("FAIL", result["audit_status"])
        self.assertTrue(
            any(
                item["check"] == "path-case-collision"
                and item["status"] == "FAIL"
                for item in result["findings"]
            )
        )

    def test_mojibake_in_active_file_fails(self):
        self.write("README.md", "# CGPA v6.1.1\n\n\u00c3\u00a9\n")
        result = self.run_audit()
        self.assertEqual("FAIL", result["audit_status"])

    def test_markdown_output_keeps_governance_notice(self):
        output = render_markdown(self.run_audit())
        self.assertIn("does not authorize a Gate", output)

    def test_configuration_schema_is_checked(self):
        path = self.root / "config.json"
        path.write_text(json.dumps({"schema_version": 2}), encoding="utf-8")
        with self.assertRaises(ValueError):
            load_config(path)


if __name__ == "__main__":
    unittest.main()
