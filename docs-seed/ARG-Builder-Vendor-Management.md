# ARG-Builder: Vendor Management Framework

## Procurement, Evaluation, and Ongoing Management of Third-Party Vendors and Tools

---

## 1. Executive Summary

As ARG-Builder scales, the number of vendors, tools, and third-party services grows exponentially. Without structured vendor management, companies face security risks, budget overruns, redundant tools, and compliance gaps. This framework defines the complete vendor lifecycle — from evaluation and procurement to ongoing management and renewal decisions.

---

## 2. Vendor Categories

### 2.1 Vendor Classification

| Category | Examples | Risk Level | Approval |
|----------|----------|-----------|----------|
| Infrastructure (critical) | AWS, Cloudflare, Datadog | Critical | CTO + CEO |
| AI/ML providers | OpenAI, Anthropic | Critical | CTO + CEO |
| Business applications | Salesforce, HubSpot, Slack | High | Department head + Finance |
| Development tools | GitHub, Linear, Figma | Medium | Engineering lead |
| Marketing tools | SEMrush, Mailchimp, Webflow | Medium | Marketing lead + Finance |
| HR/People | Rippling, Lattice, Lever | High | VP People + Finance |
| Finance/Legal | Stripe, QuickBooks, Ironclad | High | CFO |
| Security | CrowdStrike, Snyk, Vanta | Critical | CTO + Security |
| Office/productivity | Google Workspace, Notion, Zoom | Medium | Operations |
| Professional services | Consultants, agencies, contractors | Varies | Hiring manager + Finance |

### 2.2 Vendor Risk Tiers

| Tier | Criteria | Review Frequency | Security Assessment |
|------|----------|-----------------|-------------------|
| Tier 1 (Critical) | Processes customer data, > $50K/year, or single point of failure | Quarterly | Full security review |
| Tier 2 (High) | Accesses internal data, $10K–$50K/year | Semi-annual | Security questionnaire |
| Tier 3 (Medium) | Limited data access, $1K–$10K/year | Annual | Basic assessment |
| Tier 4 (Low) | No data access, < $1K/year | At renewal | Self-certification |

---

## 3. Vendor Evaluation Process

### 3.1 Evaluation Workflow

| Step | Activity | Owner | Timeline |
|------|----------|-------|----------|
| 1 | Identify need and requirements | Requesting team | — |
| 2 | Check for existing tools that solve the need | Operations | 1 day |
| 3 | Research options (3–5 vendors minimum) | Requesting team | 1 week |
| 4 | Security and compliance pre-screen | Security | 3 days |
| 5 | Demo/trial evaluation | Requesting team | 1–2 weeks |
| 6 | Reference checks (2–3 customers) | Requesting team | 1 week |
| 7 | Commercial negotiation | Finance + requesting team | 1 week |
| 8 | Legal review (contract/DPA) | Legal | 1 week |
| 9 | Final approval | Approver (per tier) | 2 days |
| 10 | Onboarding and implementation | Requesting team + IT | 1–2 weeks |

### 3.2 Evaluation Scorecard

| Criterion | Weight | Score (1–5) | Notes |
|-----------|--------|-------------|-------|
| Functionality fit | 25% | — | Does it solve our specific problem? |
| Security & compliance | 20% | — | SOC 2, encryption, access controls |
| Integration capability | 15% | — | Works with our existing stack |
| Pricing & value | 15% | — | Cost relative to value delivered |
| Vendor stability | 10% | — | Funding, revenue, team size |
| Support quality | 10% | — | Responsiveness, expertise |
| Scalability | 5% | — | Can grow with us |

### 3.3 Security Assessment Requirements

| Tier | Requirements |
|------|-------------|
| Tier 1 | SOC 2 Type II, penetration test results, DPA, security questionnaire (200+ questions), architecture review |
| Tier 2 | SOC 2 Type I or II, DPA, security questionnaire (100 questions) |
| Tier 3 | Security self-assessment, privacy policy review, DPA (if data access) |
| Tier 4 | Privacy policy review only |

---

## 4. Procurement & Contracting

### 4.1 Approval Matrix

| Annual Spend | Approver | Additional Requirements |
|-------------|----------|----------------------|
| < $1,000 | Team lead | None |
| $1,000–$10,000 | Department head | Budget confirmation |
| $10,000–$50,000 | Department head + CFO | Business case, 2 quotes |
| $50,000–$100,000 | CFO + CEO | Business case, 3 quotes, board awareness |
| > $100,000 | CEO + Board | Full business case, board approval |

### 4.2 Contract Requirements

| Element | Requirement | Negotiation Priority |
|---------|-------------|---------------------|
| Term | Annual preferred (flexibility) | High |
| Payment terms | Net 30, annual prepay for discount | Medium |
| Auto-renewal | Require 60-day notice, no auto-increase | High |
| Price protection | Cap annual increases at 5% | High |
| Termination | 30-day termination for cause | High |
| Data ownership | Customer owns all data | Critical |
| Data deletion | 30-day deletion post-termination | Critical |
| SLA | Defined uptime + credits | High |
| Liability | Adequate liability cap | Medium |
| Insurance | Cyber insurance required (Tier 1–2) | Medium |
| Audit rights | Right to audit (Tier 1) | Medium |

### 4.3 Negotiation Tactics

| Tactic | When to Use | Expected Savings |
|--------|-------------|-----------------|
| Annual prepay discount | When cash allows | 10–20% |
| Multi-year commitment | Stable, critical vendors | 15–30% |
| Competitive quotes | Always | 10–25% |
| End-of-quarter timing | Vendor fiscal quarter end | 10–20% |
| Bundle pricing | Multiple products from same vendor | 15–25% |
| Startup/growth pricing | When available | 20–50% |
| Usage commitment | Predictable usage | 10–20% |
| Reference/case study exchange | When vendor requests | 5–15% or added features |

---

## 5. Vendor Inventory & Spend Management

### 5.1 Vendor Registry

| Field | Description |
|-------|-------------|
| Vendor name | Legal entity name |
| Category | Per classification above |
| Risk tier | 1–4 |
| Owner | Internal owner/admin |
| Contract start/end | Term dates |
| Annual spend | Total annual cost |
| Payment frequency | Monthly/quarterly/annual |
| Auto-renewal date | Notice deadline |
| DPA status | Signed/pending/not required |
| Security review date | Last assessment |
| Users/licenses | Current usage |
| Business justification | Why we have this vendor |

### 5.2 Spend Analysis

| Category | Monthly Budget | Annual Budget | % of Total |
|----------|--------------|--------------|-----------|
| Infrastructure | $15,000 | $180,000 | 30% |
| Business applications | $8,000 | $96,000 | 16% |
| Development tools | $5,000 | $60,000 | 10% |
| Marketing tools | $6,000 | $72,000 | 12% |
| HR/People | $3,000 | $36,000 | 6% |
| Security | $4,000 | $48,000 | 8% |
| AI/ML providers | $8,000 | $96,000 | 16% |
| Office/productivity | $2,000 | $24,000 | 4% |
| **Total** | **$51,000** | **$612,000** | **100%** |

### 5.3 License Optimization

| Activity | Frequency | Goal |
|----------|-----------|------|
| Usage audit (active vs. provisioned) | Monthly | Identify unused licenses |
| Rightsizing review | Quarterly | Downgrade underused tiers |
| Consolidation assessment | Semi-annual | Reduce redundant tools |
| Renewal negotiation prep | 90 days before renewal | Optimize pricing |
| New tool justification | Before any new purchase | Prevent tool sprawl |

---

## 6. Ongoing Vendor Management

### 6.1 Vendor Review Cadence

| Tier | Review Type | Frequency | Participants |
|------|------------|-----------|-------------|
| Tier 1 | Business review + security | Quarterly | Owner + Security + Finance |
| Tier 2 | Performance review | Semi-annual | Owner + Finance |
| Tier 3 | Usage review | Annual | Owner |
| Tier 4 | Renewal review | At renewal | Owner |

### 6.2 Vendor Performance Metrics

| Metric | Measurement | Target |
|--------|-------------|--------|
| Uptime/availability | Monitoring data | Per SLA (99.9%+) |
| Support response time | Ticket data | Per SLA |
| Issue resolution time | Ticket data | Per SLA |
| Security incidents | Incident reports | 0 |
| Feature delivery | Roadmap tracking | On schedule |
| User satisfaction | Internal survey | > 4/5 |
| Cost per user/unit | Spend / usage | Decreasing trend |
| Contract compliance | Audit | 100% |

### 6.3 Vendor Relationship Management

| Activity | Frequency | Purpose |
|----------|-----------|---------|
| Quarterly business review (Tier 1) | Quarterly | Strategic alignment, roadmap |
| Account manager check-in | Monthly | Issue resolution, updates |
| Escalation path documentation | Annual | Know who to contact |
| Executive relationship | Semi-annual | Strategic partnership |
| Feedback provision | Quarterly | Product improvement |
| Reference participation | As requested | Relationship building |

---

## 7. Renewal & Exit Management

### 7.1 Renewal Process

| Timeline | Activity | Owner |
|----------|----------|-------|
| 120 days before | Renewal reminder triggered | Operations |
| 90 days before | Usage and value assessment | Tool owner |
| 75 days before | Renewal decision (renew/renegotiate/cancel) | Owner + Finance |
| 60 days before | Negotiation begins (if renewing) | Finance |
| 45 days before | Contract review (if changes) | Legal |
| 30 days before | Final approval and signature | Approver |
| Renewal date | Contract renewed or terminated | Operations |

### 7.2 Renewal Decision Framework

| Decision | Criteria |
|----------|----------|
| Renew (as-is) | High usage, good value, no issues |
| Renew (renegotiate) | Good tool but overpriced, or need different terms |
| Downgrade | Low usage, can reduce tier/licenses |
| Replace | Better alternative available, or vendor declining |
| Cancel | No longer needed, redundant, or poor performance |

### 7.3 Vendor Exit Checklist

| Step | Activity | Timeline |
|------|----------|----------|
| 1 | Notify vendor of non-renewal (per contract terms) | Per notice period |
| 2 | Export all data from vendor system | Before termination |
| 3 | Migrate workflows to replacement (if applicable) | Before termination |
| 4 | Revoke all access credentials | At termination |
| 5 | Remove integrations and API connections | At termination |
| 6 | Confirm data deletion by vendor | 30 days post-termination |
| 7 | Update vendor registry | At termination |
| 8 | Communicate change to affected users | Before migration |
| 9 | Archive contract and records | Post-termination |

---

## 8. Compliance & Risk

### 8.1 Vendor Compliance Requirements

| Requirement | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|-------------|--------|--------|--------|--------|
| SOC 2 report | Required | Required | Preferred | — |
| DPA signed | Required | Required | If data access | — |
| Security questionnaire | Required | Required | Basic | — |
| Cyber insurance | Required | Required | — | — |
| Business continuity plan | Required | Preferred | — | — |
| Penetration test results | Required | — | — | — |
| Sub-processor list | Required | Required | — | — |
| Incident notification | Required | Required | Required | — |

### 8.2 Vendor Risk Monitoring

| Signal | Detection | Response |
|--------|-----------|----------|
| Security breach (vendor) | News monitoring, vendor notification | Assess impact, activate incident response |
| Financial instability | News, payment issues | Assess continuity risk, identify alternatives |
| Service degradation | Monitoring, user reports | Escalate, document for review |
| Compliance lapse (SOC 2 expiry) | Calendar tracking | Request updated report, assess risk |
| Key personnel departure | Relationship management | Assess impact on service quality |
| Acquisition/merger | News monitoring | Assess continuity, contract implications |

---

## 9. Tool Stack Rationalization

### 9.1 Current Tool Stack (Target State)

| Function | Primary Tool | Backup/Alternative | Annual Cost |
|----------|-------------|-------------------|-------------|
| Cloud infrastructure | AWS | — | $120,000 |
| AI/ML inference | OpenAI + Anthropic | — | $96,000 |
| CRM | HubSpot | — | $36,000 |
| Communication | Slack | — | $18,000 |
| Video conferencing | Zoom | Google Meet | $12,000 |
| Project management | Linear | — | $8,000 |
| Design | Figma | — | $6,000 |
| Code repository | GitHub | — | $12,000 |
| Monitoring | Datadog | — | $36,000 |
| Email marketing | HubSpot (included) | — | $0 |
| HR/Payroll | Rippling | — | $24,000 |
| Security | Vanta + Snyk | — | $30,000 |
| Analytics | Mixpanel + GA4 | — | $18,000 |
| Documentation | Notion | — | $6,000 |
| Customer support | Intercom | — | $24,000 |

### 9.2 Rationalization Principles

| Principle | Implementation |
|-----------|---------------|
| One tool per function | Eliminate redundancy |
| Platform over point solution | Prefer integrated suites |
| Usage-based justification | Every tool must have active users |
| Security-first selection | Compliance requirements met |
| Scalability consideration | Can grow with us to 200+ employees |
| Integration capability | Must connect to existing stack |

---

## 10. Governance & Reporting

### 10.1 Vendor Governance Committee

| Member | Role | Responsibility |
|--------|------|---------------|
| CFO (Chair) | Financial oversight | Budget approval, spend control |
| CTO | Technical assessment | Security, architecture fit |
| VP Operations | Process management | Vendor lifecycle, registry |
| Legal Counsel | Contract review | Terms, compliance, risk |
| Department heads | Usage advocacy | Justify and manage tools |

### 10.2 Reporting Cadence

| Report | Frequency | Audience | Content |
|--------|-----------|----------|---------|
| Vendor spend report | Monthly | Finance + leadership | Spend by category, trends |
| License utilization | Monthly | Department heads | Usage vs. provisioned |
| Security compliance status | Quarterly | CTO + Security | Compliance gaps, risks |
| Vendor performance | Quarterly | Governance committee | SLA compliance, issues |
| Annual vendor review | Annual | Executive team | Full portfolio assessment |
| Renewal calendar | Monthly | Operations + Finance | Upcoming renewals |

### 10.3 KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| Tool utilization rate | > 80% | Active users / licensed users |
| Vendor spend as % of revenue | < 15% | Total vendor spend / ARR |
| On-time renewal decisions | > 95% | Decisions made before notice deadline |
| Security assessment coverage | 100% (Tier 1–2) | Assessed / total Tier 1–2 |
| Contract compliance | 100% | Compliant vendors / total |
| Savings from negotiation | > 15% of renewals | Savings / original price |
| Tool redundancy | < 5% | Overlapping tools / total tools |
