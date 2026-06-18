# SAE First Template: AI Opportunity Intake

This template is the first shippable Sovereign Automation Engine workflow for NexusAI.

It qualifies AI automation leads from:

- `nexusai.ma` website forms
- Intch conversations
- WhatsApp intake forms
- partner or agency referrals

## What it does

The workflow receives a lead request, normalizes the payload, scores the lead, recommends the best starter offer, and returns a JSON response.

It also prepares:

- `persistenceRecord` for Notion, Airtable, Google Sheets, or CRM.
- `notification` for WhatsApp, email, Slack, or Telegram alerts.
- `proposalDraft` for Claude, OpenAI, Gemini, Cursor, or manual proposal writing.
- enrichment fields such as `detectedIndustry`, `primaryUseCase`, `dataSensitivity`, `scoreBreakdown`, and `recommendedStack`.

Recommended offers:

- `Free AI Opportunity Audit`
- `AI WhatsApp Assistant`
- `Business Automation Sprint`
- `MVP/App Launch Sprint`

## Files

- n8n workflow: `workflows/sae-first-intake-webhook.json`
- SAE blueprint: `blueprints/sae-first-intake-webhook.json`
- sample payload: `examples/sae-first-intake-payload.json`
- connector mapping: `docs/connectors.md`
- reality-case testing: `docs/reality-case-testing.md`
- validator: `scripts/validate_sae_template.py`
- smoke runner: `scripts/smoke_sae_workflow.js`

## Import into n8n

1. Open n8n.
2. Import `workflows/sae-first-intake-webhook.json`.
3. Open the workflow and use test mode, or activate it.
4. Send a `POST` request to the generated webhook URL with the sample payload.

Sample local n8n test URL:

`http://localhost:5678/webhook-test/sae-ai-opportunity-intake`

Sample production n8n URL:

`https://YOUR_N8N_DOMAIN/webhook/sae-ai-opportunity-intake`

## Test payload

Use `examples/sae-first-intake-payload.json`.

Expected response highlights:

- `qualification`: `hot`
- `score`: `6`
- `recommendedOffer`: `AI WhatsApp Assistant`
- `primaryUseCase`: `ai_whatsapp_assistant`
- `detectedIndustry`: `healthcare`
- `dataSensitivity`: `high`
- `persistenceRecord.status`: `Discovery call needed`
- `notification.shouldNotify`: `true`
- `proposalDraft.title`: `AI WhatsApp Assistant for Atlas Dental Clinic`
- `nextAction`: `Book a discovery call and prepare a paid pilot proposal.`

## Ship checklist

- Run `python3 scripts/validate_sae_template.py`.
- Run `node scripts/smoke_sae_workflow.js`.
- Run `node scripts/run_sae_scenarios.js`.
- Import the workflow into n8n.
- Confirm the webhook path is `sae-ai-opportunity-intake`.
- Send the sample payload.
- Connect the final webhook URL to the website, Intch follow-up form, or WhatsApp intake flow.
- Map `persistenceRecord` into the selected CRM or spreadsheet.
- Map `notification` into WhatsApp, email, Slack, or Telegram.
- Send `proposalDraft.aiPrompt` to the chosen AI model once credentials are available.

## Next logical upgrades

1. Choose the default NexusAI CRM target.
2. Add live n8n app nodes for the selected persistence and notification tools.
3. Add a live Claude, OpenAI, or Gemini node for `proposalDraft.aiPrompt`.
4. Save generated proposals back against `leadId`.
