#!/usr/bin/env python3
"""
Analyseur de rapports DMARC agrégés depuis le bucket S3 loyertracker-inbound-mail.

Usage:
    python3 analyze-dmarc-reports.py [--days N] [--json]

Sortie par défaut : résumé texte des N derniers jours (défaut 7).
Avec --json : sortie JSON structurée pour consommation programmatique.

Nécessite : boto3, défaut profil AWS (ou AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY dans l'environnement).
"""

import argparse
import email
import gzip
import io
import json
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from datetime import datetime, timezone, timedelta
from typing import Any

import boto3

BUCKET = "loyertracker-inbound-mail"
PREFIX = "dmarc/"
S3_CLIENT = boto3.client("s3")


def list_dmarc_objects() -> list[dict[str, Any]]:
    """Liste tous les objets sous dmarc/ dans S3, hors AMAZON_SES_SETUP_NOTIFICATION."""
    objects: list[dict[str, Any]] = []
    paginator = S3_CLIENT.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET, Prefix=PREFIX):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if "AMAZON_SES_SETUP_NOTIFICATION" in key:
                continue
            objects.append(
                {
                    "key": key,
                    "size": obj["Size"],
                    "last_modified": obj["LastModified"],
                }
            )
    return sorted(objects, key=lambda o: o["last_modified"], reverse=True)


def parse_dmarc_report(s3_key: str) -> dict[str, Any] | None:
    """Télécharge et parse un rapport DMARC depuis S3. Retourne None si non parsable."""
    try:
        resp = S3_CLIENT.get_object(Bucket=BUCKET, Key=s3_key)
        raw = resp["Body"].read()
    except Exception as e:
        print(f"  ⚠️  Erreur S3 sur {s3_key}: {e}", file=sys.stderr)
        return None

    msg = email.message_from_bytes(raw)
    for part in msg.walk():
        content_type = part.get_content_type()
        payload = part.get_payload(decode=True)
        if payload is None:
            continue

        xml_data: bytes | None = None
        if content_type == "application/gzip":
            xml_data = gzip.decompress(payload)
        elif content_type == "application/zip":
            import zipfile

            z = zipfile.ZipFile(io.BytesIO(payload))
            names = z.namelist()
            if names:
                xml_data = z.read(names[0])
        elif content_type in ("text/xml", "application/xml"):
            xml_data = payload

        if xml_data is None:
            continue

        try:
            root = ET.fromstring(xml_data)
        except ET.ParseError:
            continue

        ns = {"f": "urn:ietf:params:xml:ns:dmarc:1.0"}
        # Fallback sans namespace
        if not root.find("report_metadata"):
            ns = {}

        report: dict[str, Any] = {
            "report_id": _text(root, "report_metadata/report_id", ns),
            "org_name": _text(root, "report_metadata/org_name", ns),
            "date_begin": _int(root, "report_metadata/date_range/begin", ns),
            "date_end": _int(root, "report_metadata/date_range/end", ns),
            "policy_domain": _text(root, "policy_published/domain", ns),
            "policy_p": _text(root, "policy_published/p", ns),
            "records": [],
        }

        for record in root.findall("record", ns):
            rec: dict[str, Any] = {
                "source_ip": _text(record, "row/source_ip", ns),
                "count": _int(record, "row/count", ns),
                "disposition": _text(record, "row/policy_evaluated/disposition", ns),
                "dkim": _text(record, "row/policy_evaluated/dkim", ns),
                "spf": _text(record, "row/policy_evaluated/spf", ns),
                "header_from": _text(record, "identifiers/header_from", ns),
                "dkim_results": [],
                "spf_results": [],
            }
            for dkim_el in record.findall("auth_results/dkim", ns):
                rec["dkim_results"].append(
                    {
                        "domain": _text(dkim_el, "domain", ns),
                        "result": _text(dkim_el, "result", ns),
                        "selector": _text(dkim_el, "selector", ns),
                    }
                )
            for spf_el in record.findall("auth_results/spf", ns):
                rec["spf_results"].append(
                    {
                        "domain": _text(spf_el, "domain", ns),
                        "result": _text(spf_el, "result", ns),
                    }
                )
            report["records"].append(rec)

        return report

    return None


def _text(root: ET.Element, xpath: str, ns: dict) -> str | None:
    el = root.find(xpath, ns)
    return el.text if el is not None and el.text else None


def _int(root: ET.Element, xpath: str, ns: dict) -> int | None:
    val = _text(root, xpath, ns)
    return int(val) if val else None


def analyze_reports(days: int = 7) -> dict[str, Any]:
    """Analyse les rapports des N derniers jours."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    objects = list_dmarc_objects()
    recent = [o for o in objects if o["last_modified"] >= cutoff]

    summary: dict[str, Any] = {
        "period_days": days,
        "total_reports": len(recent),
        "total_emails": 0,
        "dkim_pass": 0,
        "dkim_fail": 0,
        "spf_pass": 0,
        "spf_fail": 0,
        "dispositions": defaultdict(int),
        "sources": defaultdict(int),
        "reports": [],
    }

    for obj in recent:
        report = parse_dmarc_report(obj["key"])
        if report is None:
            continue

        report_summary = {
            "report_id": report["report_id"],
            "org_name": report["org_name"],
            "date": datetime.fromtimestamp(report["date_begin"], tz=timezone.utc).isoformat()
            if report["date_begin"]
            else None,
            "records": [],
        }

        for rec in report["records"]:
            count = rec["count"] or 0
            summary["total_emails"] += count
            summary["dispositions"][rec["disposition"] or "unknown"] += count
            summary["sources"][rec["source_ip"] or "unknown"] += count

            dkim_ok = rec["dkim"] == "pass"
            spf_ok = rec["spf"] == "pass"
            if dkim_ok:
                summary["dkim_pass"] += count
            else:
                summary["dkim_fail"] += count
            if spf_ok:
                summary["spf_pass"] += count
            else:
                summary["spf_fail"] += count

            report_summary["records"].append(
                {
                    "source_ip": rec["source_ip"],
                    "count": count,
                    "dkim": rec["dkim"],
                    "spf": rec["spf"],
                    "disposition": rec["disposition"],
                    "header_from": rec["header_from"],
                    "dkim_details": rec["dkim_results"],
                    "spf_details": rec["spf_results"],
                }
            )

        summary["reports"].append(report_summary)

    return summary


def print_summary(summary: dict[str, Any]) -> None:
    """Affiche un résumé texte lisible."""
    print(f"📊 Rapports DMARC — {summary['period_days']} derniers jours")
    print(f"   Rapports reçus : {summary['total_reports']}")
    print(f"   Emails total    : {summary['total_emails']}")
    print()
    print("🔐 Authentification :")
    dkim_total = summary["dkim_pass"] + summary["dkim_fail"]
    spf_total = summary["spf_pass"] + summary["spf_fail"]
    dkim_pct = (summary["dkim_pass"] / dkim_total * 100) if dkim_total > 0 else 0
    spf_pct = (summary["spf_pass"] / spf_total * 100) if spf_total > 0 else 0
    print(f"   DKIM : {summary['dkim_pass']} pass / {summary['dkim_fail']} fail ({dkim_pct:.0f}%)")
    print(f"   SPF  : {summary['spf_pass']} pass / {summary['spf_fail']} fail ({spf_pct:.0f}%)")
    print()
    print("📋 Dispositions :")
    for disp, count in sorted(summary["dispositions"].items()):
        print(f"   {disp}: {count}")
    print()
    print("🌐 Sources IP :")
    for ip, count in sorted(summary["sources"].items(), key=lambda x: -x[1]):
        print(f"   {ip}: {count}")
    print()
    print("📄 Détail par rapport :")
    for r in summary["reports"]:
        print(f"   [{r['org_name']}] {r['date']} — {len(r['records'])} enregistrement(s)")
        for rec in r["records"]:
            status = "✅" if rec["dkim"] == "pass" and rec["spf"] == "pass" else "❌"
            print(
                f"      {status} {rec['source_ip']} ×{rec['count']} "
                f"DKIM={rec['dkim']} SPF={rec['spf']} from={rec['header_from']}"
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyseur de rapports DMARC")
    parser.add_argument("--days", type=int, default=7, help="Nombre de jours à analyser (défaut: 7)")
    parser.add_argument("--json", action="store_true", help="Sortie JSON")
    args = parser.parse_args()

    summary = analyze_reports(days=args.days)

    if args.json:
        # Convertir defaultdict en dict pour JSON
        summary["dispositions"] = dict(summary["dispositions"])
        summary["sources"] = dict(summary["sources"])
        print(json.dumps(summary, indent=2, default=str))
    else:
        print_summary(summary)

    # Code de sortie : 1 si échec DKIM ou SPF détecté
    if summary["dkim_fail"] > 0 or summary["spf_fail"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
