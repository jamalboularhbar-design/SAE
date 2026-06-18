# SAE
Sovereign Automation Engine

SAE is the operating layer for shipping practical AI automation templates for NexusAI clients in Morocco and abroad.

## First shippable template

`SAE - First AI Opportunity Intake` is a credential-free n8n workflow that qualifies incoming AI automation leads, recommends the right starter offer, and prepares persistence, notification, and proposal payloads.

Key files:

- `src/sae_first_intake_code.js`
- `workflows/sae-first-intake-webhook.json`
- `blueprints/sae-first-intake-webhook.json`
- `examples/sae-first-intake-payload.json`
- `examples/scenarios/`
- `docs/first-template.md`
- `docs/connectors.md`
- `docs/reality-case-testing.md`

## Validate

Run:

`python3 scripts/validate_sae_template.py`

The validator checks that the workflow is valid JSON, has the expected n8n nodes and connections, requires no credentials, and that the sample Moroccan lead produces the expected qualification.

Then run:

`node scripts/smoke_sae_workflow.js`

The smoke test executes the workflow's n8n Code node logic against the sample payload.

Then run:

`node scripts/run_sae_scenarios.js`

The scenario test executes the workflow against realistic Moroccan and international lead cases.

If you edit `src/sae_first_intake_code.js`, sync it into the n8n export with:

`python3 scripts/sync_workflow_code.py`
