#!/usr/bin/env python3
"""Sync the maintained SAE Code node source into the n8n workflow export."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "src" / "sae_first_intake_code.js"
WORKFLOW_PATH = ROOT / "workflows" / "sae-first-intake-webhook.json"
CODE_NODE_NAME = "Normalize + Score Lead"


def main() -> int:
    workflow = json.loads(WORKFLOW_PATH.read_text(encoding="utf-8"))
    source = SOURCE_PATH.read_text(encoding="utf-8").strip()

    for node in workflow["nodes"]:
        if node.get("name") == CODE_NODE_NAME:
            node.setdefault("parameters", {})["jsCode"] = source
            break
    else:
        raise SystemExit(f"Code node not found: {CODE_NODE_NAME}")

    WORKFLOW_PATH.write_text(json.dumps(workflow, indent=2) + "\n", encoding="utf-8")
    print(f"Synced {SOURCE_PATH.relative_to(ROOT)} into {WORKFLOW_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
