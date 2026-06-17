# SAE Connector Mapping

The first template remains credential-free so it can be imported and tested anywhere. Live client delivery happens by mapping the response objects into the client's preferred tools.

## Persistence

Use `persistenceRecord` as the canonical lead object.

Recommended minimum fields:

- `leadId`
- `companyName`
- `market`
- `language`
- `sourceChannel`
- `problem`
- `urgency`
- `budget`
- `qualification`
- `score`
- `recommendedOffer`
- `nextAction`
- `status`
- `capturedAt`
- `tags`
- `cndpNote`

Connector mapping:

- Notion: create database item from `persistenceRecord`.
- Airtable: create record from `persistenceRecord`.
- Google Sheets: append one row from `persistenceRecord`.
- CRM: create or update lead by `companyName` or `leadId`, then attach `proposalDraft`.

## Hot-lead notifications

Use `notification.shouldNotify` as the routing condition.

Send only when:

`notification.shouldNotify === true`

Payload fields:

- `notification.priority`
- `notification.title`
- `notification.message`
- `notification.callToAction`

Recommended channels:

- WhatsApp for owner/operator follow-up.
- Email for audit trail.
- Slack or Telegram for agency/team delivery.

## AI proposal generation

Use `proposalDraft.aiPrompt` as the first AI model prompt.

Recommended model roles:

- Claude: richer proposal reasoning and client-facing copy.
- OpenAI or Gemini: fast proposal variants and summaries.
- Cursor/me: delivery planning, implementation scopes, and technical proposal review.

Store the generated proposal against the same `leadId`.

## Shipping order

1. Import and test the base workflow.
2. Connect the selected persistence tool.
3. Add the hot-lead notification branch.
4. Add an AI model node for `proposalDraft.aiPrompt`.
5. Save the generated proposal back to the persisted lead.
