# ARG-Builder Email Automation Setup Guide

**Purpose:** Connect the leads database to an automated nurture campaign that converts landing page and ROI calculator submissions into demo requests and founding customers.

---

## Architecture Overview

ARG-Builder captures leads through two entry points: the product landing page contact form and the ROI calculator "Get Custom Report" form. Both store leads in the `leads` table with source tracking. The goal is to connect this data to an email automation platform that delivers a 5-touch nurture sequence over 21 days.

---

## Recommended Platform: Resend + React Email

For a founder-stage SaaS product, **Resend** (resend.com) is the recommended email platform. It offers a generous free tier (3,000 emails/month), a developer-friendly API, and native React Email support for building beautiful transactional and marketing emails. The alternative is **Mailchimp**, which offers more visual campaign building but is more expensive and heavier for this use case.

| Feature | Resend | Mailchimp | SendGrid |
|---|---|---|---|
| Free tier | 3,000 emails/month | 500 contacts | 100 emails/day |
| API quality | Excellent (REST) | Good | Good |
| React Email | Native support | No | No |
| Price at 10K emails | $20/month | $45/month | $19.95/month |
| Setup complexity | Low | Medium | Medium |

---

## Implementation Steps

### Step 1: Create a Resend Account

Sign up at **resend.com** and verify your sending domain. You will need to add DNS records (SPF, DKIM, DMARC) to your domain registrar. Resend provides step-by-step instructions for this process. Use `hello@argbuilder.io` as the sender address (once the domain is registered).

### Step 2: Add the Resend API Key to the Project

Use the Manus `webdev_request_secrets` tool to add the Resend API key as an environment variable:

```
Key: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxx (from Resend dashboard)
```

### Step 3: Install the Resend SDK

```bash
pnpm add resend
```

### Step 4: Create the Email Service

Create a new file `server/email.ts` with the following structure:

```typescript
import { Resend } from 'resend';
import { env } from './_core/env';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendNurtureEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  return resend.emails.send({
    from: 'Jamal at ARG-Builder <hello@argbuilder.io>',
    to: params.to,
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo || 'jamal.boularhbar@gmail.com',
  });
}
```

### Step 5: Create the Nurture Sequence

The 5-email sequence should be triggered when a new lead is submitted. Each email is sent at a specific delay after the lead creation date.

| Email | Delay | Subject Line | Content Focus |
|---|---|---|---|
| **Welcome** | Immediate | "Your ARG-Builder ROI report is ready" | Personalized ROI summary, link to full calculator, CTA to book demo |
| **Value** | Day 3 | "The hidden cost of scattered knowledge" | Industry stats, link to State of Operational Knowledge report |
| **Social Proof** | Day 7 | "How mid-market teams are solving knowledge chaos" | Case study framework, feature highlights, CTA to demo |
| **Urgency** | Day 14 | "Founding customer spots are filling up" | Founding program details (30% off, 24 months), limited to 20 |
| **Final** | Day 21 | "Last chance: Your personalized demo awaits" | Direct ask for 30-min demo, calendar link, "no hard feelings" close |

### Step 6: Trigger Emails on Lead Submission

Modify the `leads.submit` procedure in `server/routers.ts` to trigger the welcome email immediately after a lead is saved:

```typescript
// In the leads.submit mutation, after saving to DB:
await sendNurtureEmail({
  to: input.email,
  subject: 'Your ARG-Builder ROI report is ready',
  html: generateWelcomeEmail(input.fullName, input.teamSize),
});
```

### Step 7: Schedule Follow-Up Emails

For the delayed emails (Day 3, 7, 14, 21), use one of two approaches:

**Option A: Resend Scheduled Sends** — Resend supports scheduling emails up to 72 hours in advance. For emails beyond 72 hours, use Option B.

**Option B: Periodic Updates** — Use the Manus periodic updates system to run a daily job that checks for leads whose nurture emails are due and sends them. Read `/home/ubuntu/agent-reference-guide/references/periodic-updates.md` for implementation details.

### Step 8: Track Email Engagement

Add columns to the `leads` table to track nurture progress:

```sql
ALTER TABLE leads ADD COLUMN nurture_step INT DEFAULT 0;
ALTER TABLE leads ADD COLUMN last_email_sent_at BIGINT;
ALTER TABLE leads ADD COLUMN email_opened BOOLEAN DEFAULT FALSE;
```

---

## Email Content Templates

### Email 1: Welcome (Immediate)

**Subject:** Your ARG-Builder ROI report is ready

Hi {firstName},

Thank you for exploring ARG-Builder. Based on your inputs ({teamSize} team members), here's what we calculated:

**Your projected annual savings: {netSavings}**
**ROI: {roi}%**
**Payback period: {paybackDays} days**

These numbers are based on IDC research showing that employees spend 9.3 hours/week searching for information. ARG-Builder reduces that by 60% through AI-powered knowledge governance.

Want to see how it works for your specific use case? Book a 30-minute personalized demo:

[Book Your Demo →]

Best,
Jamal Boularhbar
Founder & CEO, ARG-Builder

---

### Email 2: Value (Day 3)

**Subject:** The hidden cost of scattered knowledge

Hi {firstName},

Did you know that McKinsey found 67% of employees can't find the information they need? For a company your size, that translates to thousands of hours lost every year.

I wrote a report on this: "The State of Operational Knowledge in 2026." It covers the data behind the problem, why traditional tools fail at 200+ employees, and a 5-pillar framework for building operational intelligence.

[Download the Report →]

If any of this resonates with what you're experiencing at {company}, I'd love to chat.

Best,
Jamal

---

### Email 3: Social Proof (Day 7)

**Subject:** How mid-market teams are solving knowledge chaos

Hi {firstName},

Here's what I keep hearing from operations leaders:

"We have documentation. The problem is nobody can find it, nobody trusts it, and nobody knows if it's current."

ARG-Builder solves this with three capabilities that traditional wikis don't have:

1. **Knowledge Graph** — See how every document connects to every other document
2. **AI Governance** — Automatically detect stale content, duplicates, and broken links
3. **Reading Analytics** — Know who's actually reading your SOPs (not just page views)

These aren't future features. They're live today. 288 features shipped across 92 database tables.

Want to see it? 30 minutes is all it takes.

[Book Your Demo →]

Best,
Jamal

---

### Email 4: Urgency (Day 14)

**Subject:** Founding customer spots are filling up

Hi {firstName},

Quick update: we're offering our first 20 customers a founding program:

- 30% discount, locked for 24 months
- Direct Slack access to me (the founder)
- Quarterly product roadmap input sessions

We've had strong interest since launching, and spots are going faster than expected.

If operational knowledge management is on your radar for Q3, this is the best deal you'll get. The discount disappears once we hit 20 customers.

[Claim Your Founding Spot →]

No pressure either way. Happy to answer any questions.

Best,
Jamal

---

### Email 5: Final (Day 21)

**Subject:** Last chance: Your personalized demo awaits

Hi {firstName},

This is my last email in this sequence — I promise I'm not going to keep filling your inbox.

If the timing isn't right, no hard feelings at all. I'll keep sharing insights about operational knowledge management on LinkedIn if you'd like to stay in the loop.

But if you're even slightly curious about how ARG-Builder could help {company}, I'd love 30 minutes of your time. No pitch — just a conversation about your documentation challenges and whether we can help.

[Book a Conversation →]

Either way, thank you for your time. I genuinely appreciate it.

Best,
Jamal Boularhbar
Founder & CEO, ARG-Builder

---

## Monitoring and Optimization

Track these metrics weekly to optimize the nurture sequence:

| Metric | Target | Action if Below Target |
|---|---|---|
| Open rate | > 40% | Revise subject lines, test send times |
| Click rate | > 8% | Improve CTA placement and copy |
| Demo booking rate | > 5% of leads | Shorten sequence, add phone follow-up |
| Unsubscribe rate | < 2% | Reduce frequency, improve relevance |
