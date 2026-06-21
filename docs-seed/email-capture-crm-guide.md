# ARG Builder — Email Capture & CRM Integration Guide

**Purpose:** Connect the demo request form on /product to your CRM and email automation tool so leads are nurtured automatically.

---

## Current State

The ARG Builder landing page (/product) already captures demo requests via a form that submits to the `leads.submitDemo` tRPC procedure. Leads are stored in the `leads` table in the database with the following fields:

| Field | Description |
|-------|-------------|
| fullName | Contact's full name |
| email | Work email address |
| company | Company name |
| jobTitle | Role/title |
| teamSize | Selected industry vertical |
| message | Operational challenge description |
| createdAt | Timestamp of submission |

The system also sends an owner notification via `notifyOwner()` when a new lead is submitted.

---

## Option 1: HubSpot Integration (Recommended for Mid-Market)

HubSpot's free CRM tier handles up to 1,000,000 contacts and includes email sequences.

### Setup Steps

1. **Create a HubSpot account** at https://www.hubspot.com/products/crm
2. **Generate a Private App token** in Settings → Integrations → Private Apps
3. **Add the secret** to your project via Settings → Secrets: `HUBSPOT_API_KEY`
4. **Create a webhook** in the `leads.submitDemo` procedure that POSTs to HubSpot's Contacts API

### Implementation Pattern

```typescript
// In server/routers.ts — after saving the lead to DB
const hubspotKey = process.env.HUBSPOT_API_KEY;
if (hubspotKey) {
  await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hubspotKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        email: input.email,
        firstname: input.fullName.split(' ')[0],
        lastname: input.fullName.split(' ').slice(1).join(' '),
        company: input.company,
        jobtitle: input.jobTitle,
        industry: input.teamSize,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
      },
    }),
  });
}
```

### Email Sequence to Create in HubSpot

| Email | Timing | Subject | Purpose |
|-------|--------|---------|---------|
| 1 | Immediate | "Your ARG Builder demo is confirmed" | Acknowledge + set expectations |
| 2 | Day 2 | "How [Industry] teams use ARG Builder" | Industry-specific case study |
| 3 | Day 5 | "Your team is losing $X/year to knowledge chaos" | ROI angle with calculator link |
| 4 | Day 8 | "Quick question about your ops setup" | Personal touch, invite to reply |
| 5 | Day 14 | "Last chance: 14-day free trial expiring" | Urgency + trial CTA |

---

## Option 2: Mailchimp Integration (Simpler, Email-Focused)

Best if you primarily need email nurturing without full CRM features.

### Setup Steps

1. Create a Mailchimp account and audience list
2. Generate an API key in Account → Extras → API keys
3. Add `MAILCHIMP_API_KEY` and `MAILCHIMP_LIST_ID` to project secrets
4. Use Mailchimp's Marketing API to add subscribers

### Implementation Pattern

```typescript
const mailchimpKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.MAILCHIMP_LIST_ID;
const dc = mailchimpKey?.split('-').pop(); // datacenter from key

if (mailchimpKey && listId) {
  await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`anystring:${mailchimpKey}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: input.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: input.fullName.split(' ')[0],
        LNAME: input.fullName.split(' ').slice(1).join(' '),
        COMPANY: input.company,
        JOBTITLE: input.jobTitle,
        INDUSTRY: input.teamSize,
      },
      tags: ['demo-request', input.teamSize],
    }),
  });
}
```

---

## Option 3: Zapier/Make Webhook (No-Code)

If you prefer a no-code approach, add a webhook call after lead submission.

### Setup Steps

1. Create a Zap in Zapier: Trigger = Webhook (Catch Hook)
2. Copy the webhook URL
3. Add `ZAPIER_WEBHOOK_URL` to project secrets
4. POST lead data to the webhook after DB save

From Zapier, you can connect to any CRM (HubSpot, Salesforce, Pipedrive, etc.) or email tool (Mailchimp, ConvertKit, ActiveCampaign) without writing code.

---

## Recommended Automation Flows

### Flow 1: Immediate Response
```
Lead submitted → Send confirmation email (< 2 min) → Slack notification to sales
```

### Flow 2: Lead Scoring
```
Lead submitted → Check company size (LinkedIn API) → Score lead → 
  High score: Route to sales for immediate call
  Low score: Add to nurture sequence
```

### Flow 3: Demo Booking
```
Lead submitted → Send Calendly link → If no booking in 48h → Follow-up email
```

---

## GDPR & Privacy Considerations

When implementing email automation, ensure compliance with privacy regulations:

1. **Consent:** The form should include a clear statement that submitting = consent to receive emails
2. **Unsubscribe:** Every automated email must include an unsubscribe link
3. **Data retention:** Define how long you keep lead data (recommend 24 months max)
4. **Right to deletion:** Implement a way for leads to request data deletion
5. **Privacy policy:** Link to your privacy policy from the form

### Suggested Form Addition

Add this text below the submit button on /product:

> "By submitting this form, you agree to receive product updates and marketing communications from ARG Builder. You can unsubscribe at any time."

---

## Next Steps

1. Choose your CRM/email tool (HubSpot recommended for your stage)
2. Create the account and get API credentials
3. Add the API key to Settings → Secrets in the Manus dashboard
4. Let me know which option you chose and I'll implement the integration
