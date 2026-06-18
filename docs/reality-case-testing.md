# Testing SAE with Reality Cases

Use these tests after importing `workflows/sae-first-intake-webhook.json` into n8n.

## What to prove

A realistic test should prove that the workflow:

- receives a lead payload through the webhook,
- detects the market, industry, and use case,
- scores lead quality,
- recommends the right NexusAI offer,
- creates a CRM-ready `persistenceRecord`,
- decides whether a hot-lead notification should be sent,
- prepares a proposal prompt for Claude, OpenAI, Gemini, or Cursor.

## Local automated test

Run:

`node scripts/run_sae_scenarios.js`

This executes the actual n8n Code node against every file in `examples/scenarios`.

Current scenarios:

- `moroccan-dental-whatsapp.json`: Moroccan clinic needing WhatsApp appointment qualification.
- `real-estate-lead-followup.json`: Moroccan real estate agency losing WhatsApp/Facebook leads.
- `international-agency-outsourcing.json`: foreign agency looking for a white-label AI delivery partner.
- `early-unclear-lead.json`: weak lead that needs clarification before an audit.

## n8n manual test

1. Import the workflow into n8n.
2. Open the workflow.
3. Click `Execute workflow` or enable test mode for the webhook.
4. Copy the webhook test URL.
5. Send one scenario payload to the webhook URL.

Expected checks in the response:

- Hot Moroccan WhatsApp leads should recommend `AI WhatsApp Assistant`.
- Agency outsourcing leads should recommend `AI Outsourcing Partner`.
- Unclear leads should stay `early` and avoid hot notifications.
- Healthcare leads should return `dataSensitivity: high`.
- Every response should include `persistenceRecord`, `notification`, `proposalDraft`, and `connectorTargets`.

## Example payload to paste

Use the `payload` object inside:

`examples/scenarios/moroccan-dental-whatsapp.json`

Expected highlights:

- `qualification`: `hot`
- `recommendedOffer`: `AI WhatsApp Assistant`
- `primaryUseCase`: `ai_whatsapp_assistant`
- `detectedIndustry`: `healthcare`
- `dataSensitivity`: `high`
- `notification.shouldNotify`: `true`
