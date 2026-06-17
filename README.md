# SAE
Sovereign Automation Engine

SAE is the operating layer for shipping practical AI automation templates for NexusAI clients in Morocco and abroad.

## First shippable template

`SAE - First AI Opportunity Intake` is a credential-free n8n workflow that qualifies incoming AI automation leads, recommends the right starter offer, and prepares persistence, notification, and proposal payloads.

Key files:

- `workflows/sae-first-intake-webhook.json`
- `blueprints/sae-first-intake-webhook.json`
- `examples/sae-first-intake-payload.json`
- `docs/first-template.md`
- `docs/connectors.md`

## Validate

Run:

`python3 scripts/validate_sae_template.py`

The validator checks that the workflow is valid JSON, has the expected n8n nodes and connections, requires no credentials, and that the sample Moroccan lead produces the expected qualification.

Then run:

`node scripts/smoke_sae_workflow.js`

The smoke test executes the workflow's n8n Code node logic against the sample payload.
