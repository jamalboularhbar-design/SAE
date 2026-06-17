# SAE First Template: AI Opportunity Intake

This template is the first shippable Sovereign Automation Engine workflow for NexusAI.

It qualifies AI automation leads from:

- `nexusai.ma` website forms
- Intch conversations
- WhatsApp intake forms
- partner or agency referrals

## What it does

The workflow receives a lead request, normalizes the payload, scores the lead, recommends the best starter offer, and returns a JSON response.

Recommended offers:

- `Free AI Opportunity Audit`
- `AI WhatsApp Assistant`
- `Business Automation Sprint`
- `MVP/App Launch Sprint`

## Files

- n8n workflow: `workflows/sae-first-intake-webhook.json`
- SAE blueprint: `blueprints/sae-first-intake-webhook.json`
- sample payload: `examples/sae-first-intake-payload.json`
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
- `score`: `5`
- `recommendedOffer`: `Business Automation Sprint`
- `nextAction`: `Book a discovery call and prepare a paid pilot proposal.`

## Ship checklist

- Run `python3 scripts/validate_sae_template.py`.
- Run `node scripts/smoke_sae_workflow.js`.
- Import the workflow into n8n.
- Confirm the webhook path is `sae-ai-opportunity-intake`.
- Send the sample payload.
- Connect the final webhook URL to the website, Intch follow-up form, or WhatsApp intake flow.

## Next logical upgrades

1. Add lead persistence to Notion, Airtable, Google Sheets, or a CRM.
2. Add WhatsApp or email notifications for hot leads.
3. Add an AI summary node once provider credentials are ready.
4. Generate a draft proposal from the recommended offer.
