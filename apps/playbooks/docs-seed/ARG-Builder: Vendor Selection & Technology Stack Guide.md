# ARG-Builder: Vendor Selection & Technology Stack Guide

## Executive Summary

This document defines ARG-Builder's complete technology stack recommendations and vendor selection methodology — the tools, platforms, and services that power every function of the business. Each recommendation is based on stage-appropriateness, integration capability, total cost of ownership, and scalability.

---

## Technology Stack by Function

### Engineering & Product

| Category | Recommended Tool | Alternative | Monthly Cost (Starter) | Scale Cost |
|----------|-----------------|-------------|----------------------|-----------|
| **Source control** | GitHub (Team) | GitLab | $4/user | $21/user |
| **CI/CD** | GitHub Actions | CircleCI | Included | $30/user |
| **Cloud hosting** | AWS | GCP, Azure | $2K–$5K | $10K–$50K |
| **Container orchestration** | AWS ECS / Kubernetes | Fly.io | $500–$2K | $5K–$20K |
| **Database (primary)** | PostgreSQL (RDS) | PlanetScale | $200–$500 | $2K–$10K |
| **Cache/Queue** | Redis (ElastiCache) | Upstash | $100–$300 | $1K–$5K |
| **Search** | Elasticsearch / Typesense | Algolia | $200–$500 | $2K–$10K |
| **Monitoring** | Datadog | New Relic, Grafana | $500–$1K | $3K–$15K |
| **Error tracking** | Sentry | Bugsnag | $26/month | $80–$300 |
| **Feature flags** | LaunchDarkly | Flagsmith | $10/month | $500–$2K |
| **Project management** | Linear | Jira, Shortcut | $8/user | $8/user |
| **Documentation** | Notion | Confluence | $10/user | $10/user |
| **Design** | Figma | Sketch | $15/user | $45/user |
| **AI/LLM** | OpenAI API + Anthropic | Cohere, local models | $500–$2K | $5K–$30K |

### Sales & Marketing

| Category | Recommended Tool | Alternative | Monthly Cost (Starter) | Scale Cost |
|----------|-----------------|-------------|----------------------|-----------|
| **CRM** | HubSpot (Professional) | Salesforce | $500/month | $2K–$10K |
| **Email automation** | Customer.io | Iterable, Braze | $150/month | $1K–$5K |
| **Marketing automation** | HubSpot Marketing | Marketo | Included with CRM | $2K–$8K |
| **Analytics (web)** | Google Analytics 4 + Mixpanel | Amplitude | Free + $25/month | $1K–$5K |
| **SEO** | Ahrefs | SEMrush | $99/month | $399/month |
| **Social media** | Buffer | Hootsuite | $6/channel | $99/month |
| **Advertising** | Google Ads + LinkedIn | Meta, Reddit | Variable | Variable |
| **Content management** | Webflow | WordPress | $29/month | $49/month |
| **Video hosting** | Loom + Wistia | Vidyard | $15/user + $99 | $300–$1K |
| **Scheduling** | Calendly | Chili Piper | $10/user | $30/user |
| **Sales engagement** | Apollo.io | Outreach, Salesloft | $49/user | $100/user |
| **Proposal/CPQ** | PandaDoc | Proposify | $49/user | $99/user |

### Customer Success & Support

| Category | Recommended Tool | Alternative | Monthly Cost (Starter) | Scale Cost |
|----------|-----------------|-------------|----------------------|-----------|
| **Help desk** | Intercom | Zendesk, Freshdesk | $74/user | $132/user |
| **Knowledge base** | Intercom (included) | Help Scout | Included | $50–$200 |
| **In-app messaging** | Intercom | Pendo, Appcues | Included | $500–$2K |
| **Customer health** | Vitally | Gainsight, Totango | $150/user | $200/user |
| **NPS/Surveys** | Delighted | SurveyMonkey | $224/month | $449/month |
| **Screen recording** | FullStory | Hotjar, LogRocket | $199/month | $500–$2K |
| **Community** | Circle | Discourse | $89/month | $399/month |
| **Webinars** | Zoom Webinars | Demio | $79/month | $183/month |

### Finance & Operations

| Category | Recommended Tool | Alternative | Monthly Cost (Starter) | Scale Cost |
|----------|-----------------|-------------|----------------------|-----------|
| **Accounting** | QuickBooks Online | Xero | $30/month | $200/month |
| **Billing/Subscriptions** | Stripe Billing | Chargebee, Recurly | 0.5% of revenue | 0.5–0.8% |
| **Expense management** | Ramp | Brex, Divvy | Free | Free |
| **Payroll** | Gusto | Rippling, Deel | $40 + $6/person | $8–$12/person |
| **HRIS** | Rippling | BambooHR | $8/user | $15/user |
| **Legal** | Ironclad | DocuSign CLM | $500/month | $2K/month |
| **Cap table** | Carta | Pulley | $100/month | $500/month |
| **Tax** | External CPA | Pilot | $2K–$5K/month | $5K–$10K |

### Security & Compliance

| Category | Recommended Tool | Alternative | Monthly Cost (Starter) | Scale Cost |
|----------|-----------------|-------------|----------------------|-----------|
| **SOC 2 automation** | Vanta | Drata, Secureframe | $500/month | $1.5K/month |
| **Penetration testing** | Cobalt | HackerOne | $2K/quarter | $5K/quarter |
| **Secrets management** | AWS Secrets Manager | HashiCorp Vault | $50/month | $200/month |
| **SSO/Identity** | Auth0 | Okta, WorkOS | $23/month | $500–$3K |
| **MDM** | Kandji | Jamf (Mac) | $5/device | $10/device |
| **Password management** | 1Password Business | LastPass | $8/user | $8/user |
| **VPN** | Tailscale | WireGuard | $5/user | $18/user |

---

## Vendor Selection Methodology

### Evaluation Criteria (Weighted)

| Criterion | Weight | Scoring (1–5) | Description |
|-----------|--------|---------------|-------------|
| Functionality fit | 25% | Does it solve our specific needs? | Feature match to requirements |
| Ease of implementation | 15% | How quickly can we deploy? | Time to value |
| Integration capability | 15% | Does it connect with our stack? | API quality, native integrations |
| Scalability | 15% | Will it grow with us? | Pricing model, performance at scale |
| Total cost of ownership | 15% | What's the true 3-year cost? | License + implementation + maintenance |
| Vendor stability | 10% | Will they be around in 3 years? | Funding, revenue, market position |
| Security & compliance | 5% | Do they meet our standards? | SOC 2, GDPR, certifications |

### Selection Process

| Phase | Duration | Activities | Output |
|-------|----------|-----------|--------|
| Requirements | 1 week | Define must-haves, nice-to-haves, deal-breakers | Requirements document |
| Long list | 1 week | Research 5–8 vendors, read reviews | Long list with notes |
| Short list | 1 week | Demo 3–4 vendors, score against criteria | Scored comparison |
| Deep evaluation | 2 weeks | Trial/POC with top 2, reference checks | Evaluation report |
| Decision | 3 days | Final scoring, negotiate pricing | Vendor selected |
| Procurement | 1–2 weeks | Contract review, security review, sign | Executed agreement |

---

## Total Stack Cost Projections

### By Stage

| Stage | Team Size | Monthly Stack Cost | Per-Employee Cost | Key Additions |
|-------|-----------|-------------------|------------------|---------------|
| Pre-seed (1–5) | 3–5 | $3K–$5K | $800–$1,200 | Core dev tools, basic CRM |
| Seed (5–15) | 8–15 | $8K–$15K | $800–$1,100 | Marketing tools, CS platform |
| Series A (15–40) | 20–40 | $25K–$50K | $1,000–$1,400 | Enterprise tools, security |
| Series B (40–100) | 50–100 | $60K–$120K | $1,100–$1,300 | Scale tools, compliance |

---

## Migration & Switching Strategy

### When to Switch Vendors

| Signal | Action | Timeline |
|--------|--------|----------|
| Vendor raises prices > 30% | Evaluate alternatives | 60–90 days |
| Critical feature gap (blocking growth) | Evaluate alternatives | 30–60 days |
| Repeated outages (> 3 in 90 days) | Begin migration planning | 60–90 days |
| Vendor acquired (uncertainty) | Evaluate, plan contingency | 90–180 days |
| Team outgrows tool capabilities | Plan upgrade/migration | 90–120 days |
| Security incident at vendor | Immediate review, potential switch | 30–60 days |

---

*Document prepared by Manus AI for ARG-Builder technology operations.*
