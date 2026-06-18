#!/usr/bin/env python3
"""Validate the first SAE n8n workflow template without external dependencies."""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW_PATH = ROOT / "workflows" / "sae-first-intake-webhook.json"
BLUEPRINT_PATH = ROOT / "blueprints" / "sae-first-intake-webhook.json"
SAMPLE_PAYLOAD_PATH = ROOT / "examples" / "sae-first-intake-payload.json"
SOURCE_PATH = ROOT / "src" / "sae_first_intake_code.js"
SCENARIOS_PATH = ROOT / "examples" / "scenarios"


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise AssertionError(f"{path.relative_to(ROOT)} is not valid JSON: {exc}") from exc


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def first_text(*values: object, default: str = "") -> str:
    for value in values:
        if isinstance(value, str) and value.strip():
            return value.strip()
    return default


def validate_workflow(workflow: dict, source_code: str) -> None:
    require(workflow.get("id") == "sae-first-intake-webhook", "workflow has the wrong top-level n8n ID")
    require(workflow.get("name") == "SAE - First AI Opportunity Intake", "workflow has the wrong template name")
    require(isinstance(workflow.get("nodes"), list) and len(workflow["nodes"]) == 3, "workflow must contain exactly 3 nodes")
    require(isinstance(workflow.get("connections"), dict), "workflow connections must be an object")

    node_ids = [node.get("id") for node in workflow["nodes"]]
    node_names = [node.get("name") for node in workflow["nodes"]]
    require(len(node_ids) == len(set(node_ids)), "workflow node IDs must be unique")
    require(len(node_names) == len(set(node_names)), "workflow node names must be unique")

    nodes_by_name = {node["name"]: node for node in workflow["nodes"]}
    require("SAE Intake Webhook" in nodes_by_name, "workflow is missing the webhook trigger")
    require("Normalize + Score Lead" in nodes_by_name, "workflow is missing lead scoring logic")
    require("Return SAE Intake Result" in nodes_by_name, "workflow is missing webhook response node")

    webhook = nodes_by_name["SAE Intake Webhook"]
    require(webhook.get("type") == "n8n-nodes-base.webhook", "trigger must be an n8n webhook node")
    require(webhook["parameters"].get("httpMethod") == "POST", "webhook must use POST")
    require(webhook["parameters"].get("path") == "sae-ai-opportunity-intake", "webhook path changed unexpectedly")
    require(webhook["parameters"].get("responseMode") == "responseNode", "webhook must respond via response node")

    code_node = nodes_by_name["Normalize + Score Lead"]
    require(code_node.get("type") == "n8n-nodes-base.code", "lead scoring must use an n8n code node")
    js_code = code_node.get("parameters", {}).get("jsCode", "")
    require(js_code.strip() == source_code.strip(), "workflow Code node is out of sync with src/sae_first_intake_code.js")
    for expected in [
        "qualification",
        "recommendedOffer",
        "Business Automation Sprint",
        "AI WhatsApp Assistant",
        "AI Outsourcing Partner",
        "persistenceRecord",
        "notification",
        "proposalDraft",
        "connectorTargets",
        "scoreBreakdown",
        "dataSensitivity",
        "auditChecklist",
        "recommendedStack",
    ]:
        require(expected in js_code, f"lead scoring code is missing {expected}")

    for node in workflow["nodes"]:
        require("credentials" not in node, f"{node['name']} should not require credentials")
        require(isinstance(node.get("position"), list) and len(node["position"]) == 2, f"{node['name']} needs an n8n canvas position")

    response_node = nodes_by_name["Return SAE Intake Result"]
    require(response_node["parameters"].get("respondWith") == "json", "response node must return JSON")
    require(response_node["parameters"].get("responseBody") == "={{ $json }}", "response node must return the lead result object")

    first_hop = workflow["connections"]["SAE Intake Webhook"]["main"][0][0]
    second_hop = workflow["connections"]["Normalize + Score Lead"]["main"][0][0]
    require(first_hop["node"] == "Normalize + Score Lead", "webhook must connect to lead scoring")
    require(second_hop["node"] == "Return SAE Intake Result", "lead scoring must connect to response node")


def validate_blueprint(blueprint: dict) -> None:
    require(blueprint.get("id") == "sae-first-intake-webhook", "blueprint ID changed unexpectedly")
    require(blueprint.get("status") == "ship-ready", "blueprint must be marked ship-ready")
    require(blueprint.get("workflow", {}).get("path") == "workflows/sae-first-intake-webhook.json", "blueprint workflow path is invalid")
    require(blueprint.get("workflow", {}).get("requiresCredentials") is False, "first template must remain credential-free")
    outputs = blueprint.get("outputs", [])
    for expected in ["persistenceRecord", "notification", "proposalDraft", "connectorTargets"]:
        require(expected in outputs, f"blueprint outputs must include {expected}")
    require(len(blueprint.get("connectorTargets", [])) >= 6, "blueprint needs connector target mappings")
    require(len(blueprint.get("shippingChecklist", [])) >= 8, "blueprint needs a practical shipping checklist")


def validate_sample_payload(sample_payload: dict) -> None:
    for expected in ["companyName", "contactName", "phone", "market", "industry", "problem", "channel"]:
        require(first_text(sample_payload.get(expected)), f"sample payload must include {expected}")
    require(len(first_text(sample_payload.get("problem"))) >= 20, "sample payload needs a realistic problem")


def validate_scenarios() -> None:
    scenario_files = sorted(SCENARIOS_PATH.glob("*.json"))
    require(len(scenario_files) >= 4, "expected at least four realistic scenario files")

    required_expected_keys = {
        "qualification",
        "recommendedOffer",
        "primaryUseCase",
        "detectedIndustry",
        "dataSensitivity",
        "shouldNotify",
    }

    for path in scenario_files:
        scenario = load_json(path)
        require(isinstance(scenario.get("payload"), dict), f"{path.relative_to(ROOT)} needs a payload object")
        expected = scenario.get("expected")
        require(isinstance(expected, dict), f"{path.relative_to(ROOT)} needs an expected object")
        missing = required_expected_keys - set(expected)
        require(not missing, f"{path.relative_to(ROOT)} expected object missing: {sorted(missing)}")


def main() -> int:
    workflow = load_json(WORKFLOW_PATH)
    blueprint = load_json(BLUEPRINT_PATH)
    sample_payload = load_json(SAMPLE_PAYLOAD_PATH)
    source_code = SOURCE_PATH.read_text(encoding="utf-8")

    validate_workflow(workflow, source_code)
    validate_blueprint(blueprint)
    validate_sample_payload(sample_payload)
    validate_scenarios()

    print("SAE first n8n template validation passed.")
    print(f"- workflow: {WORKFLOW_PATH.relative_to(ROOT)}")
    print(f"- blueprint: {BLUEPRINT_PATH.relative_to(ROOT)}")
    print(f"- sample lead: {sample_payload['companyName']} is realistic and scenario-backed")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as exc:
        print(f"Validation failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
