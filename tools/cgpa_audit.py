#!/usr/bin/env python3
"""Deterministic structural audit for the CGPA framework repository."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path, PurePosixPath
from typing import Iterable
from urllib.parse import unquote


MARKDOWN_LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
EXTERNAL_SCHEMES = ("http://", "https://", "mailto:", "tel:", "data:")
LOCAL_ABSOLUTE = re.compile(r"^(?:file:/{2,}|[A-Za-z]:[\\/]|/(?:home|Users|tmp)/)")


@dataclass(frozen=True)
class Finding:
    check: str
    status: str
    path: str
    message: str


def load_config(path: Path) -> dict:
    with path.open(encoding="utf-8") as stream:
        config = json.load(stream)
    if config.get("schema_version") != 1:
        raise ValueError("Unsupported audit configuration schema_version")
    return config


def git_tracked_paths(root: Path) -> list[str]:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=root,
        check=True,
        capture_output=True,
    )
    return [
        item.decode("utf-8").replace("\\", "/")
        for item in result.stdout.split(b"\0")
        if item
    ]


def exact_path_exists(path: str, tracked: set[str]) -> bool:
    normalized = str(PurePosixPath(path))
    return normalized in tracked or any(
        item.startswith(normalized.rstrip("/") + "/") for item in tracked
    )


def add(
    findings: list[Finding],
    check: str,
    passed: bool,
    path: str,
    failure: str,
    success: str,
) -> None:
    findings.append(
        Finding(check, "PASS" if passed else "FAIL", path, success if passed else failure)
    )


def check_required_paths(
    config: dict, tracked: set[str], findings: list[Finding]
) -> None:
    for path in config.get("required_paths", []):
        add(
            findings,
            "required-path",
            exact_path_exists(path, tracked),
            path,
            "Required tracked path is missing or has different casing",
            "Required tracked path exists with exact casing",
        )


def check_case_collisions(tracked: set[str], findings: list[Finding]) -> None:
    by_casefold: dict[str, list[str]] = {}
    for path in sorted(tracked):
        by_casefold.setdefault(path.casefold(), []).append(path)
    collisions = [paths for paths in by_casefold.values() if len(paths) > 1]
    add(
        findings,
        "path-case-collision",
        not collisions,
        ".",
        "Case-insensitive path collisions: "
        + "; ".join(", ".join(paths) for paths in collisions),
        "No case-insensitive tracked path collision",
    )


def read_text(root: Path, path: str) -> str:
    return (root / PurePosixPath(path)).read_text(encoding="utf-8-sig")


def check_content(config: dict, root: Path, findings: list[Finding]) -> None:
    for path, markers in config.get("required_content", {}).items():
        file_path = root / PurePosixPath(path)
        if not file_path.is_file():
            findings.append(
                Finding("required-content", "FAIL", path, "File cannot be inspected")
            )
            continue
        text = read_text(root, path)
        for marker in markers:
            add(
                findings,
                "required-content",
                marker in text,
                path,
                f"Required marker is missing: {marker}",
                f"Required marker found: {marker}",
            )


def normalize_link_target(raw: str) -> str:
    target = raw.strip()
    if target.startswith("<") and target.endswith(">"):
        target = target[1:-1]
    elif " " in target:
        target = target.split(maxsplit=1)[0]
    return unquote(target)


def resolve_relative(source: str, target: str) -> str:
    base = PurePosixPath(source).parent
    parts: list[str] = []
    for part in (base / target).parts:
        if part in ("", "."):
            continue
        if part == "..":
            if parts:
                parts.pop()
            else:
                return ""
        else:
            parts.append(part)
    return str(PurePosixPath(*parts))


def check_markdown_links(
    config: dict,
    root: Path,
    tracked: set[str],
    findings: list[Finding],
) -> None:
    scopes = config.get("markdown_link_scopes", [])
    markdown_paths = sorted(
        path
        for path in tracked
        if path.lower().endswith(".md")
        and any(path == scope or path.startswith(scope.rstrip("/") + "/") for scope in scopes)
    )
    broken: list[str] = []
    nonportable: list[str] = []
    checked = 0
    for source in markdown_paths:
        if not (root / PurePosixPath(source)).is_file():
            broken.append(f"{source} -> tracked Markdown source is missing")
            continue
        text = read_text(root, source)
        for match in MARKDOWN_LINK.finditer(text):
            target = normalize_link_target(match.group(1))
            if not target or target.startswith("#") or target.startswith(EXTERNAL_SCHEMES):
                continue
            if LOCAL_ABSOLUTE.match(target):
                nonportable.append(f"{source} -> {target}")
                continue
            target_without_anchor = target.split("#", 1)[0]
            if not target_without_anchor:
                continue
            checked += 1
            resolved = resolve_relative(source, target_without_anchor)
            if not resolved or not exact_path_exists(resolved, tracked):
                broken.append(f"{source} -> {target}")
    add(
        findings,
        "markdown-links",
        not broken,
        ".",
        "Broken or incorrectly cased links: " + "; ".join(broken),
        f"{checked} relative Markdown links resolve with exact casing",
    )
    add(
        findings,
        "portable-links",
        not nonportable,
        ".",
        "Non-portable local links: " + "; ".join(nonportable),
        "No local absolute Markdown link",
    )


def check_encoding(config: dict, root: Path, findings: list[Finding]) -> None:
    markers = config.get("mojibake_markers", [])
    affected: list[str] = []
    for path in config.get("active_text_paths", []):
        file_path = root / PurePosixPath(path)
        if not file_path.is_file():
            continue
        text = read_text(root, path)
        if any(marker in text for marker in markers):
            affected.append(path)
    add(
        findings,
        "active-text-encoding",
        not affected,
        ".",
        "Mojibake markers found in active files: " + ", ".join(affected),
        "No configured mojibake marker in active files",
    )


def audit(root: Path, config: dict, tracked_paths: Iterable[str] | None = None) -> dict:
    root = root.resolve()
    tracked = {
        path.replace("\\", "/")
        for path in (tracked_paths if tracked_paths is not None else git_tracked_paths(root))
    }
    findings: list[Finding] = []
    check_required_paths(config, tracked, findings)
    check_case_collisions(tracked, findings)
    check_content(config, root, findings)
    check_markdown_links(config, root, tracked, findings)
    check_encoding(config, root, findings)
    failures = sum(item.status == "FAIL" for item in findings)
    return {
        "schema_version": 1,
        "framework_version": config["framework_version"],
        "audit_status": "PASS" if failures == 0 else "FAIL",
        "summary": {
            "checks": len(findings),
            "passed": len(findings) - failures,
            "failed": failures,
        },
        "findings": [asdict(item) for item in findings],
        "governance_notice": (
            "This structural audit does not authorize a Gate and does not replace "
            "the CGPA Chief Delivery Officer decision."
        ),
    }


def render_text(result: dict) -> str:
    summary = result["summary"]
    lines = [
        f"CGPA v{result['framework_version']} automated structural audit",
        f"Status: {result['audit_status']}",
        (
            f"Checks: {summary['checks']} | PASS: {summary['passed']} | "
            f"FAIL: {summary['failed']}"
        ),
    ]
    lines.extend(
        f"[{item['status']}] {item['check']} {item['path']}: {item['message']}"
        for item in result["findings"]
        if item["status"] == "FAIL"
    )
    lines.append(result["governance_notice"])
    return "\n".join(lines) + "\n"


def render_markdown(result: dict) -> str:
    summary = result["summary"]
    lines = [
        f"# Automated structural audit CGPA v{result['framework_version']}",
        "",
        f"* Status: **{result['audit_status']}**",
        f"* Checks: {summary['checks']}",
        f"* PASS: {summary['passed']}",
        f"* FAIL: {summary['failed']}",
        "",
        "| Status | Check | Path | Evidence |",
        "| --- | --- | --- | --- |",
    ]
    for item in result["findings"]:
        message = item["message"].replace("|", "\\|")
        lines.append(
            f"| {item['status']} | {item['check']} | `{item['path']}` | {message} |"
        )
    lines.extend(
        [
            "",
            "## Governance notice",
            "",
            result["governance_notice"],
            "",
        ]
    )
    return "\n".join(lines)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument(
        "--config",
        type=Path,
        default=Path("tools/cgpa-audit-config.json"),
    )
    parser.add_argument("--format", choices=("text", "json", "markdown"), default="text")
    parser.add_argument("--output", type=Path)
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    root = args.root.resolve()
    config_path = args.config
    if not config_path.is_absolute():
        config_path = root / config_path
    try:
        result = audit(root, load_config(config_path))
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f"Audit execution error: {error}", file=sys.stderr)
        return 2
    if args.format == "json":
        output = json.dumps(result, indent=2, sort_keys=True) + "\n"
    elif args.format == "markdown":
        output = render_markdown(result)
    else:
        output = render_text(result)
    if args.output:
        output_path = args.output
        if not output_path.is_absolute():
            output_path = root / output_path
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(output, encoding="utf-8", newline="\n")
    else:
        print(output, end="")
    return 0 if result["audit_status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
